import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import type { Error } from "../../types/Error";

const ChipsStyled = styled("div")({
  display: "flex",
  flexWrap: "wrap",
});

const ChipStyled = styled(Chip)({
  margin: 2,
});

interface QueueSelectProps {
  selectedQueueIds: number[];
  onChange: (queueIds: number[]) => void;
}

const QueueSelect: React.FC<QueueSelectProps> = ({
  selectedQueueIds,
  onChange,
}) => {
  interface Queue {
    id: number;
    name: string;
    color: string;
  }

  const [queues, setQueues] = useState<Queue[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/queue");
        setQueues(data);
      } catch (err) {
        toastError(err as Error);
      }
    })();
  }, []);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div style={{ marginTop: 6 }}>
      <FormControl fullWidth margin="dense" variant="outlined">
        <InputLabel>{i18n.t("queueSelect.inputLabel")}</InputLabel>
        <Select
          multiple
          // labelWidth={60}
          value={selectedQueueIds}
          onChange={handleChange}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
          }}
          renderValue={(selected: any) => (
            <ChipsStyled>
              {selected?.length > 0 &&
                selected.map((id: number) => {
                  const queue = queues.find((q) => q.id === id);
                  return queue ? (
                    <ChipStyled
                      key={id}
                      style={{ backgroundColor: queue.color }}
                      variant="outlined"
                      label={queue.name}
                    />
                  ) : null;
                })}
            </ChipsStyled>
          )}
        >
          {queues.map((queue) => (
            <MenuItem key={queue.id} value={queue.id}>
              {queue.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default QueueSelect;
