import { useState, useEffect, useRef } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import { styled } from "@mui/material/styles";
import { green } from "@mui/material/colors";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import ColorPicker from "../ColorPicker";
import { IconButton, InputAdornment } from "@mui/material";
import { Colorize } from "@mui/icons-material";
import type { Error } from "../../types/Error";

const RootStyled = styled("div")({
  display: "flex",
  flexWrap: "wrap",
});

const TextFieldStyled = styled(TextField)(({ theme }) => ({
  marginRight: theme.spacing(1),
  flex: 1,
}));

const BtnWrapperStyled = styled(Button)({
  position: "relative",
});

const ButtonProgressStyled = styled(CircularProgress)({
  color: green[500],
  position: "absolute",
  top: "50%",
  left: "50%",
  marginTop: -12,
  marginLeft: -12,
});

const ColorAdormentStyled = styled("div")({
  width: 20,
  height: 20,
});

const QueueSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  color: Yup.string().min(3, "Too Short!").max(9, "Too Long!").required(),
  greetingMessage: Yup.string(),
});

interface QueueModalProps {
  open: boolean;
  onClose: () => void;
  queueId?: string | number;
}

const QueueModal: React.FC<QueueModalProps> = ({ open, onClose, queueId }) => {
  const initialState = {
    name: "",
    color: "",
    greetingMessage: "",
  };

  const [colorPickerModalOpen, setColorPickerModalOpen] = useState(false);
  const [queue, setQueue] = useState(initialState);
  const greetingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      if (!queueId) return;
      try {
        const { data } = await api.get(`/queue/${queueId}`);
        setQueue((prevState) => {
          return { ...prevState, ...data };
        });
      } catch (err) {
        toastError(err as Error);
      }
    })();

    return () => {
      setQueue({
        name: "",
        color: "",
        greetingMessage: "",
      });
    };
  }, [queueId, open]);

  const handleClose = () => {
    onClose();
    setQueue(initialState);
  };

  const handleSaveQueue = async (values: {
    name: string;
    color: string;
    greetingMessage: string;
  }) => {
    try {
      if (queueId) {
        await api.put(`/queue/${queueId}`, values);
      } else {
        await api.post("/queue", values);
      }
      toast.success("Queue saved successfully");
      handleClose();
    } catch (err) {
      toastError(err as Error);
    }
  };

  return (
    <RootStyled>
      <Dialog open={open} onClose={handleClose} scroll="paper">
        <DialogTitle>
          {queueId
            ? `${i18n.t("queueModal.title.edit")}`
            : `${i18n.t("queueModal.title.add")}`}
        </DialogTitle>
        <Formik
          initialValues={queue}
          enableReinitialize={true}
          validationSchema={QueueSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveQueue(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting, values }) => (
            <Form>
              <DialogContent dividers>
                <Field
                  as={TextFieldStyled}
                  label={i18n.t("queueModal.form.name")}
                  autoFocus
                  name="name"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  variant="outlined"
                  margin="dense"
                />
                <Field
                  as={TextField}
                  label={i18n.t("queueModal.form.color")}
                  name="color"
                  id="color"
                  onFocus={() => {
                    setColorPickerModalOpen(true);
                    if (greetingRef.current) {
                      greetingRef.current.focus();
                    }
                  }}
                  error={touched.color && Boolean(errors.color)}
                  helperText={touched.color && errors.color}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ColorAdormentStyled
                          style={{ backgroundColor: values.color }}
                        ></ColorAdormentStyled>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <IconButton
                        size="small"
                        color="default"
                        onClick={() => setColorPickerModalOpen(true)}
                      >
                        <Colorize />
                      </IconButton>
                    ),
                  }}
                  variant="outlined"
                  margin="dense"
                />
                <ColorPicker
                  open={colorPickerModalOpen}
                  handleClose={() => setColorPickerModalOpen(false)}
                  onChange={(color) => {
                    values.color = color;
                    setQueue(() => {
                      return { ...values, color };
                    });
                  }}
                  currentColor={values.color}
                />
                <div>
                  <Field
                    as={TextField}
                    label={i18n.t("queueModal.form.greetingMessage")}
                    type="greetingMessage"
                    multiline
                    inputRef={greetingRef}
                    rows={5}
                    fullWidth
                    name="greetingMessage"
                    error={
                      touched.greetingMessage && Boolean(errors.greetingMessage)
                    }
                    helperText={
                      touched.greetingMessage && errors.greetingMessage
                    }
                    variant="outlined"
                    margin="dense"
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  {i18n.t("queueModal.buttons.cancel")}
                </Button>
                <BtnWrapperStyled
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                >
                  {queueId
                    ? `${i18n.t("queueModal.buttons.okEdit")}`
                    : `${i18n.t("queueModal.buttons.okAdd")}`}
                  {isSubmitting && <ButtonProgressStyled size={24} />}
                </BtnWrapperStyled>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </RootStyled>
  );
};

export default QueueModal;
