import { useState, useEffect } from "react";
import openSocket from "../../services/socket-io";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";

import api from "../../services/api";
import { i18n } from "../../translate/i18n.js";
import toastError from "../../errors/toastError";
import type { Error } from "../../types/Error.js";

const RootStyled = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(8, 8, 3),
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  marginBottom: 12,
}));

const Settings = () => {
  interface Setting {
    key: string;
    value: string;
  }

  const [settings, setSettings] = useState<Setting[]>([]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await api.get("/settings");
        setSettings(data);
      } catch (err) {
        toastError(err as Error);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const socket = openSocket();

    socket.on("settings", (data) => {
      if (data.action === "update") {
        setSettings((prevState) => {
          const aux = [...prevState];
          const settingIndex = aux.findIndex((s) => s.key === data.setting.key);
          //@ts-ignore
          aux[settingIndex].value = data.setting.value;
          return aux;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChangeSetting = async (e) => {
    const selectedValue = e.target.value;
    const settingKey = e.target.name;

    try {
      await api.put(`/settings/${settingKey}`, {
        value: selectedValue,
      });
      toast.success(i18n.t("settings.success"));
    } catch (err) {
      toastError(err as Error);
    }
  };

  const getSettingValue = (key: string) => {
    const setting = settings.find((s) => s.key === key);
    const value = setting ? setting.value : "";
    return value;
  };

  return (
    <RootStyled>
      <Container maxWidth="sm">
        <Typography variant="body2" gutterBottom>
          {i18n.t("settings.title")}
        </Typography>
        <PaperStyled>
          <Typography variant="body1">
            {i18n.t("settings.settings.userCreation.name")}
          </Typography>
          <Select
            margin="dense"
            variant="outlined"
            native
            id="userCreation-setting"
            name="userCreation"
            value={
              settings && settings.length > 0 && getSettingValue("userCreation")
            }
            sx={{
              marginLeft: "auto",
            }}
            onChange={handleChangeSetting}
          >
            <option value="enabled">
              {i18n.t("settings.settings.userCreation.options.enabled")}
            </option>
            <option value="disabled">
              {i18n.t("settings.settings.userCreation.options.disabled")}
            </option>
          </Select>
        </PaperStyled>

        <PaperStyled>
          <TextField
            disabled
            id="api-token-setting"
            label="Token Api"
            margin="dense"
            variant="outlined"
            fullWidth
            value={
              settings && settings.length > 0 && getSettingValue("userApiToken")
            }
          />
        </PaperStyled>
      </Container>
    </RootStyled>
  );
};

export default Settings;
