import { useState, useEffect, useContext, useRef } from "react";
// import "emoji-mart/css/emoji-mart.css";
import { useParams } from "react-router-dom";
import { Picker } from "emoji-mart";
//import MicRecorder from "mic-recorder-to-mp3";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import IconButton from "@mui/material/IconButton";
import MoreVert from "@mui/icons-material/MoreVert";
import MoodIcon from "@mui/icons-material/Mood";
import SendIcon from "@mui/icons-material/Send";
import CancelIcon from "@mui/icons-material/Cancel";
import ClearIcon from "@mui/icons-material/Clear";
import MicIcon from "@mui/icons-material/Mic";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  FormControlLabel,
  Hidden,
  Menu,
  MenuItem,
  Switch,
} from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import RecordingTimer from "./RecordingTimer";
import { ReplyMessageContext } from "../../context/ReplyingMessage/ReplyingMessageContext";
import { AuthContext } from "../../context/Auth/AuthContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import toastError from "../../errors/toastError";
import type { Error } from "../../types/Error";
import { useMp3Recorder } from "../../hooks/useMp3Recorder";

// const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const MainWrapperStyled = styled(Paper)(({ theme }) => ({
  background: "#eee",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  [theme.breakpoints.down("sm")]: {
    position: "fixed",
    bottom: 0,
    width: "100%",
  },
}));

const NewMessageBoxStyled = styled("div")({
  background: "#eee",
  width: "100%",
  display: "flex",
  padding: "7px",
  alignItems: "center",
});

const MessageInputWrapperStyled = styled("div")({
  background: "#eee",
  width: "100%",
  display: "flex",
  padding: "7px",
  alignItems: "center",
});

const MessageInputStyled = styled(InputBase)({
  paddingLeft: 10,
  flex: 1,
  border: "none",
});

const sendMessageIconsStyle = {
  color: "grey",
};

const uploadInputStyle = {
  display: "none",
};

const ViewMediaInputWrapperStyled = styled(Paper)({
  display: "flex",
  padding: "10px 13px",
  position: "relative",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#eee",
  borderTop: "1px solid rgba(0, 0, 0, 0.12)",
});

const EmojiBoxStyled = styled("div")({
  position: "absolute",
  bottom: 63,
  width: 40,
  borderTop: "1px solid #e8e8e8",
});

const CircleLoadingStyled = styled(CircularProgress)({
  color: green[500],
  opacity: "70%",
  position: "absolute",
  top: "20%",
  left: "50%",
  marginLeft: -12,
});

const AudioLoadingStyled = styled(CircularProgress)({
  color: green[500],
  opacity: "70%",
});

const RecorderWrapperStyled = styled("div")({
  display: "flex",
  alignItems: "center",
  alignContent: "middle",
});

const CancelAudioIconStyled = styled(HighlightOffIcon)({
  color: "red",
});

const ReplyginMsgWrapperStyled = styled("div")({
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  paddingTop: 8,
  paddingLeft: 73,
  paddingRight: 7,
});

const ReplyginMsgContainerStyled = styled("div")({
  flex: 1,
  marginRight: 5,
  overflowY: "hidden",
  backgroundColor: "rgba(0, 0, 0, 0.05)",
  borderRadius: "7.5px",
  display: "flex",
  position: "relative",
});

const ReplyginMsgBodyStyled = styled("div")({
  padding: 10,
  height: "auto",
  display: "block",
  whiteSpace: "pre-wrap",
  overflow: "hidden",
});

const ReplyginContactMsgSideColorStyled = styled("span")({
  flex: "none",
  width: "4px",
  backgroundColor: "#35cd96",
});

const ReplyginSelfMsgSideColorStyled = styled("span")({
  flex: "none",
  width: "4px",
  backgroundColor: "#6bcbef",
});

const MessageContactNameStyled = styled("span")({
  display: "flex",
  color: "#6bcbef",
  fontWeight: 500,
});

const MessageQuickAnswersWrapperStyled = styled("ul")({
  margin: 0,
  position: "absolute",
  bottom: "50px",
  background: "#ffffff",
  padding: "2px",
  border: "1px solid #CCC",
  left: 0,
  width: "100%",
  "& li": {
    listStyle: "none",
    "& a": {
      display: "block",
      padding: "8px",
      textOverflow: "ellipsis",
      overflow: "hidden",
      maxHeight: "32px",
      "&:hover": {
        background: "#F1F1F1",
        cursor: "pointer",
      },
    },
  },
});

const MessageInput = ({ ticketStatus }: { ticketStatus: string }) => {
  const { blob, startRecording, stopRecording } = useMp3Recorder();

  const { ticketId } = useParams();

  const [medias, setMedias] = useState<File[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  interface QuickAnswer {
    shortcut: string;
    message: string;
  }

  const [quickAnswers, setQuickAnswer] = useState<QuickAnswer[]>([]);
  const [typeBar, setTypeBar] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const replyMessageContext = useContext(ReplyMessageContext);
  const setReplyingMessage = replyMessageContext?.setReplyingMessage;
  const replyingMessage = replyMessageContext?.replyingMessage;
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const [signMessage, setSignMessage] = useLocalStorage("signOption", true);

  useEffect(() => {
    inputRef.current?.focus();
  }, [replyingMessage]);

  useEffect(() => {
    inputRef.current?.focus();
    return () => {
      setInputMessage("");
      setShowEmoji(false);
      setMedias([]);
      if (setReplyingMessage) {
        setReplyingMessage(null);
      }
    };
  }, [ticketId, setReplyingMessage]);

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target) {
      setInputMessage((e.target as HTMLInputElement).value);
    }
    if (e.target) {
      handleLoadQuickAnswer((e.target as HTMLInputElement).value);
    }
  };

  const handleQuickAnswersClick = (value: string) => {
    setInputMessage(value);
    setTypeBar(false);
  };

  interface EmojiData {
    native: string;
  }

  const handleAddEmoji = (e: EmojiData) => {
    let emoji = e.native;
    setInputMessage((prevState) => prevState + emoji);
  };

  interface MediaChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList };
  }

  const handleChangeMedias = (e: MediaChangeEvent) => {
    if (!e.target.files) {
      return;
    }

    const selectedMedias = Array.from(e.target.files) as File[];
    setMedias(selectedMedias);
  };

  const handleInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (e.clipboardData.files[0]) {
      setMedias([e.clipboardData.files[0]]);
    }
  };

  const handleUploadMedia = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append("fromMe", "true");
    medias.forEach((media) => {
      formData.append("medias", media);
      formData.append("body", media.name);
    });

    try {
      await api.post(`/messages/${ticketId}`, formData);
    } catch (err) {
      toastError(err as Error);
    }

    setLoading(false);
    setMedias([]);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;
    setLoading(true);

    const message = {
      read: 1,
      fromMe: true,
      mediaUrl: "",
      body: signMessage
        ? `*${user?.name}:*\n${inputMessage.trim()}`
        : inputMessage.trim(),
      quotedMsg: replyingMessage,
    };
    try {
      await api.post(`/messages/${ticketId}`, message);
    } catch (err) {
      toastError(err as Error);
    }

    setInputMessage("");
    setShowEmoji(false);
    setLoading(false);
    if (setReplyingMessage) {
      setReplyingMessage(null);
    }
  };

  const handleStartRecording = async () => {
    setLoading(true);
    try {
      await startRecording();
      setRecording(true);
      setLoading(false);
    } catch (err) {
      toastError(err as Error);
      setLoading(false);
    }
  };

  const handleLoadQuickAnswer = async (value: string) => {
    if (value && value.indexOf("/") === 0) {
      try {
        const { data } = await api.get("/quickAnswers/", {
          params: { searchParam: inputMessage.substring(1) },
        });
        setQuickAnswer(data.quickAnswers);
        if (data.quickAnswers.length > 0) {
          setTypeBar(true);
        } else {
          setTypeBar(false);
        }
      } catch (err) {
        setTypeBar(false);
      }
    } else {
      setTypeBar(false);
    }
  };

  const handleUploadAudio = async () => {
    setLoading(true);
    try {
      //@ts-ignore
      stopRecording();
      if (blob === null) {
        throw new Error("No audio recorded");
      }
      if (blob.size < 10000) {
        setLoading(false);
        setRecording(false);
        return;
      }

      const formData = new FormData();
      const filename = `${new Date().getTime()}.mp3`;
      formData.append("medias", blob, filename);
      formData.append("body", filename);
      formData.append("fromMe", "true");

      await api.post(`/messages/${ticketId}`, formData);
    } catch (err) {
      toastError(err as Error);
    }

    setRecording(false);
    setLoading(false);
  };

  const handleCancelAudio = async () => {
    try {
      //@ts-ignore
      stopRecording();
      setRecording(false);
    } catch (err) {
      toastError(err as Error);
    }
  };

  const handleOpenMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = () => {
    setAnchorEl(null);
  };

  const renderReplyingMessage = (message: any) => {
    return (
      <ReplyginMsgWrapperStyled>
        <ReplyginMsgContainerStyled>
          {!message.fromMe ? (
            <ReplyginSelfMsgSideColorStyled />
          ) : (
            <ReplyginContactMsgSideColorStyled />
          )}

          <ReplyginMsgBodyStyled>
            {!message.fromMe && (
              <MessageContactNameStyled>
                {message.contact?.name}
              </MessageContactNameStyled>
            )}
            {message.body}
          </ReplyginMsgBodyStyled>
        </ReplyginMsgContainerStyled>
        <IconButton
          aria-label="showRecorder"
          component="span"
          disabled={loading || ticketStatus !== "open"}
          onClick={() => setReplyingMessage && setReplyingMessage(null)}
        >
          <ClearIcon sx={sendMessageIconsStyle} />
        </IconButton>
      </ReplyginMsgWrapperStyled>
    );
  };

  if (medias.length > 0)
    return (
      <ViewMediaInputWrapperStyled elevation={0} square>
        <IconButton
          aria-label="cancel-upload"
          component="span"
          onClick={() => setMedias([])}
        >
          <CancelIcon sx={sendMessageIconsStyle} />
        </IconButton>

        {loading ? (
          <div>
            <CircleLoadingStyled />
          </div>
        ) : (
          <span>
            {medias[0]?.name}
            {/* <img src={media.preview} alt=""></img> */}
          </span>
        )}
        <IconButton
          aria-label="send-upload"
          component="span"
          onClick={handleUploadMedia}
          disabled={loading}
        >
          <SendIcon sx={sendMessageIconsStyle} />
        </IconButton>
      </ViewMediaInputWrapperStyled>
    );
  else {
    return (
      <MainWrapperStyled square elevation={0}>
        {replyingMessage && renderReplyingMessage(replyingMessage)}
        <NewMessageBoxStyled>
          {/* @ts-ignore */}
          <Hidden only={["sm", "xs"]}>
            <IconButton
              aria-label="emojiPicker"
              component="span"
              disabled={loading || recording || ticketStatus !== "open"}
              onClick={() => setShowEmoji((prevState) => !prevState)}
            >
              <MoodIcon sx={sendMessageIconsStyle} />
            </IconButton>
            {showEmoji ? (
              <EmojiBoxStyled>
                <ClickAwayListener onClickAway={(e) => setShowEmoji(false)}>
                  {/* @ts-ignore */}
                  <Picker
                    perLine={16}
                    showPreview={false}
                    showSkinTones={false}
                    onSelect={handleAddEmoji}
                  />
                </ClickAwayListener>
              </EmojiBoxStyled>
            ) : null}

            <input
              multiple
              type="file"
              id="upload-button"
              disabled={loading || recording || ticketStatus !== "open"}
              style={uploadInputStyle}
              onChange={handleChangeMedias}
            />
            <label htmlFor="upload-button">
              <IconButton
                aria-label="upload"
                component="span"
                disabled={loading || recording || ticketStatus !== "open"}
              >
                <AttachFileIcon sx={sendMessageIconsStyle} />
              </IconButton>
            </label>
            <FormControlLabel
              style={{ marginRight: 7, color: "gray" }}
              label={i18n.t("messagesInput.signMessage")}
              labelPlacement="start"
              control={
                <Switch
                  size="small"
                  checked={signMessage}
                  onChange={(e) => {
                    setSignMessage(e.target.checked);
                  }}
                  name="showAllTickets"
                  color="primary"
                />
              }
            />
          </Hidden>
          {/* @ts-ignore */}
          <Hidden only={["md", "lg", "xl"]}>
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleOpenMenuClick}
            >
              <MoreVert></MoreVert>
            </IconButton>
            <Menu
              id="simple-menu"
              keepMounted
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuItemClick}
            >
              <MenuItem onClick={handleMenuItemClick}>
                <IconButton
                  aria-label="emojiPicker"
                  component="span"
                  disabled={loading || recording || ticketStatus !== "open"}
                  onClick={() => setShowEmoji((prevState) => !prevState)}
                >
                  <MoodIcon sx={sendMessageIconsStyle} />
                </IconButton>
              </MenuItem>
              <MenuItem onClick={handleMenuItemClick}>
                <input
                  multiple
                  type="file"
                  id="upload-button"
                  disabled={loading || recording || ticketStatus !== "open"}
                  style={uploadInputStyle}
                  onChange={handleChangeMedias}
                />
                <label htmlFor="upload-button">
                  <IconButton
                    aria-label="upload"
                    component="span"
                    disabled={loading || recording || ticketStatus !== "open"}
                  >
                    <AttachFileIcon sx={sendMessageIconsStyle} />
                  </IconButton>
                </label>
              </MenuItem>
              <MenuItem onClick={handleMenuItemClick}>
                <FormControlLabel
                  style={{ marginRight: 7, color: "gray" }}
                  label={i18n.t("messagesInput.signMessage")}
                  labelPlacement="start"
                  control={
                    <Switch
                      size="small"
                      checked={signMessage}
                      onChange={(e) => {
                        setSignMessage(e.target.checked);
                      }}
                      name="showAllTickets"
                      color="primary"
                    />
                  }
                />
              </MenuItem>
            </Menu>
          </Hidden>
          <MessageInputWrapperStyled>
            <MessageInputStyled
              inputRef={inputRef}
              placeholder={
                ticketStatus === "open"
                  ? i18n.t("messagesInput.placeholderOpen")
                  : i18n.t("messagesInput.placeholderClosed")
              }
              multiline
              maxRows={5}
              value={inputMessage}
              onChange={handleChangeInput}
              disabled={recording || loading || ticketStatus !== "open"}
              onPaste={(e) => {
                ticketStatus === "open" && handleInputPaste(e);
              }}
              onKeyDown={(e) => {
                if (loading || e.shiftKey) return;
                else if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            {typeBar ? (
              <MessageQuickAnswersWrapperStyled>
                {quickAnswers.map((value, index) => {
                  return (
                    <li
                      // className={classes.messageQuickAnswersWrapperItem}
                      key={index}
                    >
                      <a onClick={() => handleQuickAnswersClick(value.message)}>
                        {`${value.shortcut} - ${value.message}`}
                      </a>
                    </li>
                  );
                })}
              </MessageQuickAnswersWrapperStyled>
            ) : (
              <div></div>
            )}
          </MessageInputWrapperStyled>
          {inputMessage ? (
            <IconButton
              aria-label="sendMessage"
              component="span"
              onClick={handleSendMessage}
              disabled={loading}
            >
              <SendIcon sx={sendMessageIconsStyle} />
            </IconButton>
          ) : recording ? (
            <RecorderWrapperStyled>
              {/* @ts-ignore */}
              <IconButton
                aria-label="cancelRecording"
                component="span"
                fontSize="large"
                disabled={loading}
                onClick={handleCancelAudio}
              >
                <CancelAudioIconStyled />
              </IconButton>
              {loading ? (
                <div>
                  <AudioLoadingStyled />
                </div>
              ) : (
                <RecordingTimer />
              )}

              <IconButton
                aria-label="sendRecordedAudio"
                component="span"
                onClick={handleUploadAudio}
                disabled={loading}
              >
                <CheckCircleOutlineIcon
                  sx={{
                    color: "green",
                  }}
                />
              </IconButton>
            </RecorderWrapperStyled>
          ) : (
            <IconButton
              aria-label="showRecorder"
              component="span"
              disabled={loading || ticketStatus !== "open"}
              onClick={handleStartRecording}
            >
              <MicIcon sx={sendMessageIconsStyle} />
            </IconButton>
          )}
        </NewMessageBoxStyled>
      </MainWrapperStyled>
    );
  }
};

export default MessageInput;
