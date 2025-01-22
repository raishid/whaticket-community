import React, { useState, useEffect, useReducer, useRef } from "react";

import { isSameDay, parseISO, format } from "date-fns";
import openSocket from "../../services/socket-io";

import { green } from "@mui/material/colors";
import { Button, CircularProgress, Divider, IconButton } from "@mui/material";
import {
  AccessTime,
  Block,
  Done,
  DoneAll,
  ExpandMore,
  GetApp,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

import MarkdownWrapper from "../MarkdownWrapper";
import VcardPreview from "../VcardPreview";
import LocationPreview from "../LocationPreview";
import ModalImageCors from "../ModalImageCors";
import MessageOptionsMenu from "../MessageOptionsMenu";
import whatsBackground from "../../assets/wa-background.png";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import Audio from "../Audio";
import type { Error } from "../../types/Error";

const MessagesListWrapperStyled = styled("div")({
  overflow: "hidden",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
});

const MessagesListStyled = styled("div")(({ theme }) => ({
  backgroundImage: `url(${whatsBackground})`,
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: "20px 20px 20px 20px",
  overflowY: "scroll",
  [theme.breakpoints.down("sm")]: {
    paddingBottom: "90px",
  },
}));

const CircleLoadingStyled = styled(CircularProgress)({
  color: green[500],
  position: "absolute",
  opacity: "70%",
  top: 0,
  left: "50%",
  marginTop: 12,
});

const MessageLeftStyled = styled("div", {
  name: "MessageLeftStyled",
})({
  marginRight: 20,
  marginTop: 2,
  minWidth: 100,
  maxWidth: 600,
  height: "auto",
  display: "block",
  position: "relative",
  "&:hover #messageActionsButton": {
    opacity: "90%",
    top: 0,
    right: 0,
  },

  whiteSpace: "pre-wrap",
  backgroundColor: "#ffffff",
  color: "#303030",
  alignSelf: "flex-start",
  borderTopLeftRadius: 0,
  borderTopRightRadius: 8,
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
  paddingLeft: 5,
  paddingRight: 5,
  paddingTop: 5,
  paddingBottom: 0,
  boxShadow: "0 1px 1px #b3b3b3",
});

const QuotedContainerLeftStyled = styled("div")({
  margin: "-3px -80px 6px -6px",
  overflow: "hidden",
  backgroundColor: "#f0f0f0",
  borderRadius: "7.5px",
  display: "flex",
  position: "relative",
});

const QuotedMsgStyled = styled("div")({
  padding: 10,
  maxWidth: 300,
  height: "auto",
  display: "block",
  whiteSpace: "pre-wrap",
  overflow: "hidden",
});

const QuotedSideColorLeft = styled("span")({
  flex: "none",
  width: "4px",
  backgroundColor: "#6bcbef",
});

const MessageRightStyled = styled("div", {
  name: "MessageRightStyled",
})({
  marginLeft: 20,
  marginTop: 2,
  minWidth: 100,
  maxWidth: 600,
  height: "auto",
  display: "block",
  position: "relative",
  "&:hover #messageActionsButton": {
    display: "flex",
    position: "absolute",
    top: 0,
    right: 0,
  },

  whiteSpace: "pre-wrap",
  backgroundColor: "#dcf8c6",
  color: "#303030",
  alignSelf: "flex-end",
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 0,
  paddingLeft: 5,
  paddingRight: 5,
  paddingTop: 5,
  paddingBottom: 0,
  boxShadow: "0 1px 1px #b3b3b3",
});

const QuotedContainerRightStyled = styled("div")({
  margin: "-3px -80px 6px -6px",
  overflowY: "hidden",
  backgroundColor: "#cfe9ba",
  borderRadius: "7.5px",
  display: "flex",
  position: "relative",
});

const QuotedMsgRightStyled = styled("div")({
  padding: 10,
  maxWidth: 300,
  height: "auto",
  whiteSpace: "pre-wrap",
});

const QuotedSideColorRight = styled("span")({
  flex: "none",
  width: "4px",
  backgroundColor: "#35cd96",
});

const MessageActionsButtonStyled = styled(IconButton)({
  opacity: "0",
  position: "absolute",
  top: "0",
  right: "0",
  color: "#999",
  zIndex: 1,
  backgroundColor: "transparent",
  "&:hover, &.Mui-focusVisible": {
    opacity: "90%",
  },
});

const MessageContactNameStyled = styled("span", {
  name: "MessageContactNameStyled",
})({
  display: "flex",
  color: "#6bcbef",
  fontWeight: 500,
});

interface TextContentItemStyledProps {
  isDeleted?: boolean;
}

const TextContentItemStyled = styled("div", {
  name: "TextContentItemStyled",
  shouldForwardProp: (prop) => prop !== "isDeleted",
})<TextContentItemStyledProps>(({ isDeleted }) => {
  if (isDeleted) {
    return {
      fontStyle: "italic",
      color: "rgba(0, 0, 0, 0.36)",
      overflowWrap: "break-word",
      padding: "3px 80px 6px 6px",
    };
  }
  return {
    overflowWrap: "break-word",
    padding: "3px 80px 6px 6px",
  };
});

const MessageMediaStyled = styled("video")({
  objectFit: "cover",
  width: 250,
  height: 200,
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
});

const TimestampStyled = styled("span")({
  fontSize: 11,
  position: "absolute",
  bottom: 0,
  right: 5,
  color: "#999",
});

const DailyTimestampStyled = styled("span")({
  alignItems: "center",
  textAlign: "center",
  alignSelf: "center",
  width: "110px",
  backgroundColor: "#e1f3fb",
  margin: "10px",
  borderRadius: "10px",
  boxShadow: "0 1px 1px #b3b3b3",
});

const DailyTimestampTextStyled = styled("div")({
  color: "#808888",
  padding: 8,
  alignSelf: "center",
  marginLeft: "0px",
});

const AckIconsStyled = {
  fontSize: 18,
  verticalAlign: "middle",
  marginLeft: 4,
};

const DeletedIconStyled = styled(Block, {
  name: "DeletedIconStyled",
})({
  fontSize: 18,
  verticalAlign: "middle",
  marginRight: 4,
});

const AckDoneAllIconStyled = styled(DoneAll)({
  color: green[500],
  fontSize: 18,
  verticalAlign: "middle",
  marginLeft: 4,
});

const DownloadMediaStyled = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "inherit",
  padding: 10,
});

type Message = {
  id: string;
  fromMe: boolean;
  mediaType?: string;
  mediaUrl?: string;
  body: string;
  createdAt: string;
  isDeleted?: boolean;
  quotedMsg?: Message;
  contact?: { name: string };
  ack?: number;
};

type Action =
  | { type: "LOAD_MESSAGES"; payload: Message[] }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "UPDATE_MESSAGE"; payload: Message }
  | { type: "RESET"; payload?: undefined };

const reducer = (state: Message[], action: Action): Message[] => {
  if (action.type === "LOAD_MESSAGES") {
    const messages = action.payload;
    const newMessages = [] as any[];

    messages.forEach((message: any) => {
      const messageIndex = state.findIndex((m) => m.id === message.id);
      if (messageIndex !== -1) {
        state[messageIndex] = message;
      } else {
        newMessages.push(message);
      }
    });

    return [...newMessages, ...state];
  }

  if (action.type === "ADD_MESSAGE") {
    const newMessage = action.payload;
    const messageIndex = state.findIndex((m) => m.id === newMessage.id);

    if (messageIndex !== -1) {
      state[messageIndex] = newMessage;
    } else {
      state.push(newMessage);
    }

    return [...state];
  }

  if (action.type === "UPDATE_MESSAGE") {
    const messageToUpdate = action.payload;
    const messageIndex = state.findIndex((m) => m.id === messageToUpdate.id);

    if (messageIndex !== -1) {
      state[messageIndex] = messageToUpdate;
    }

    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }

  return state;
};

type MessagesListProps = {
  ticketId?: string;
  isGroup: boolean;
};

const MessagesList: React.FC<MessagesListProps> = ({ ticketId, isGroup }) => {
  const [messagesList, dispatch] = useReducer(reducer, [] as Message[]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const [selectedMessage, setSelectedMessage] = useState<Message>({
    id: "",
    fromMe: false,
    body: "",
    createdAt: "",
  });
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const messageOptionsMenuOpen = Boolean(anchorEl);
  const currentTicketId = useRef(ticketId);

  useEffect(() => {
    //@ts-ignore
    dispatch({ type: "RESET" });
    setPageNumber(1);

    currentTicketId.current = ticketId;
  }, [ticketId]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchMessages = async () => {
        try {
          const { data } = await api.get("/messages/" + ticketId, {
            params: { pageNumber },
          });

          if (currentTicketId.current === ticketId) {
            //@ts-ignore
            dispatch({ type: "LOAD_MESSAGES", payload: data.messages });
            setHasMore(data.hasMore);
            setLoading(false);
          }

          if (pageNumber === 1 && data.messages.length > 1) {
            scrollToBottom();
          }
        } catch (err) {
          setLoading(false);
          toastError(err as Error);
        }
      };
      fetchMessages();
    }, 500);
    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [pageNumber, ticketId]);

  useEffect(() => {
    const socket = openSocket();

    socket.on("connect", () => socket.emit("joinChatBox", ticketId));

    socket.on("appMessage", (data) => {
      if (data.action === "create") {
        //@ts-ignore
        dispatch({ type: "ADD_MESSAGE", payload: data.message });
        scrollToBottom();
      }

      if (data.action === "update") {
        //@ts-ignore
        dispatch({ type: "UPDATE_MESSAGE", payload: data.message });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [ticketId]);

  const loadMore = () => {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({});
    }
  };

  const handleScroll = (e: React.MouseEvent<HTMLElement>) => {
    if (!hasMore) return;
    const { scrollTop } = e.currentTarget;

    if (scrollTop === 0) {
      const messagesListElement = document.getElementById("messagesList");
      if (messagesListElement) {
        messagesListElement.scrollTop = 1;
      }
    }

    if (loading) {
      return;
    }

    if (scrollTop < 50) {
      loadMore();
    }
  };

  const handleOpenMessageOptionsMenu = (
    e: React.MouseEvent<HTMLElement>,
    message: Message
  ) => {
    setAnchorEl(e.currentTarget as HTMLElement);
    setSelectedMessage(message);
  };

  const handleCloseMessageOptionsMenu = () => {
    setAnchorEl(null);
  };

  const checkMessageMedia = (message: Message) => {
    if (
      message.mediaType === "location" &&
      message.body.split("|").length >= 2
    ) {
      let locationParts = message.body.split("|");
      let imageLocation = locationParts[0];
      let linkLocation = locationParts[1];

      let descriptionLocation = null;

      if (locationParts.length > 2)
        descriptionLocation = message.body.split("|")[2];

      return (
        <LocationPreview
          image={imageLocation}
          link={linkLocation}
          description={descriptionLocation || undefined}
        />
      );
    } else if (message.mediaType === "vcard") {
      //console.log("vcard")
      //console.log(message)
      let array = message.body.split("\n");
      let obj = [];
      let contact = "";
      for (let index = 0; index < array.length; index++) {
        const v = array[index];
        let values = v.split(":");
        for (let ind = 0; ind < values.length; ind++) {
          if (values[ind].indexOf("+") !== -1) {
            obj.push({ number: values[ind] });
          }
          if (values[ind].indexOf("FN") !== -1) {
            contact = values[ind + 1];
          }
        }
      }
      return <VcardPreview contact={contact} numbers={obj[0]?.number} />;
    } else if (
      /*else if (message.mediaType === "multi_vcard") {
      console.log("multi_vcard")
      console.log(message)
    	
      if(message.body !== null && message.body !== "") {
        let newBody = JSON.parse(message.body)
        return (
          <>
            {
            newBody.map(v => (
              <VcardPreview contact={v.name} numbers={v.number} />
            ))
            }
          </>
        )
      } else return (<></>)
    }*/
      message.mediaUrl &&
      /^.*\.(jpe?g|png|gif)?$/i.exec(message.mediaUrl) &&
      message.mediaType === "image"
    ) {
      return <ModalImageCors imageUrl={message.mediaUrl} />;
    } else if (message.mediaType === "audio") {
      return message.mediaUrl ? <Audio url={message.mediaUrl} /> : null;
    } else if (message.mediaType === "video") {
      return <MessageMediaStyled src={message.mediaUrl} controls />;
    } else {
      return (
        <>
          <DownloadMediaStyled>
            {/* @ts-ignore */}
            <Button
              startIcon={<GetApp />}
              color="primary"
              variant="outlined"
              target="_blank"
              href={message.mediaUrl}
            >
              Download
            </Button>
          </DownloadMediaStyled>
          <Divider />
        </>
      );
    }
  };

  const renderMessageAck = (message: Message) => {
    if (message.ack === 0) {
      return <AccessTime fontSize="small" sx={AckIconsStyled} />;
    }
    if (message.ack === 1) {
      return <Done fontSize="small" sx={AckIconsStyled} />;
    }
    if (message.ack === 2) {
      return <DoneAll fontSize="small" sx={AckIconsStyled} />;
    }
    if (message.ack === 3 || message.ack === 4) {
      return <AckDoneAllIconStyled fontSize="small" />;
    }
  };

  const renderDailyTimestamps = (message: Message, index: number) => {
    if (index === 0) {
      return (
        <DailyTimestampStyled key={`timestamp-${message.id}`}>
          <DailyTimestampTextStyled>
            {format(parseISO(messagesList[index].createdAt), "dd/MM/yyyy")}
          </DailyTimestampTextStyled>
        </DailyTimestampStyled>
      );
    }
    if (index < messagesList.length - 1) {
      let messageDay = parseISO(messagesList[index].createdAt);
      let previousMessageDay = parseISO(messagesList[index - 1].createdAt);

      if (!isSameDay(messageDay, previousMessageDay)) {
        return (
          <DailyTimestampStyled key={`timestamp-${message.id}`}>
            <DailyTimestampTextStyled>
              {format(parseISO(messagesList[index].createdAt), "dd/MM/yyyy")}
            </DailyTimestampTextStyled>
          </DailyTimestampStyled>
        );
      }
    }
    if (index === messagesList.length - 1) {
      return (
        <div
          key={`ref-${message.createdAt}`}
          ref={lastMessageRef}
          style={{ float: "left", clear: "both" }}
        />
      );
    }
  };

  const renderMessageDivider = (message: Message, index: number) => {
    if (index < messagesList.length && index > 0) {
      let messageUser = messagesList[index].fromMe;
      let previousMessageUser = messagesList[index - 1].fromMe;

      if (messageUser !== previousMessageUser) {
        return (
          <span style={{ marginTop: 16 }} key={`divider-${message.id}`}></span>
        );
      }
    }
  };

  const renderQuotedMessage = (message: Message) => {
    return (
      <>
        {message.fromMe} ? (
        <QuotedContainerRightStyled>
          <QuotedSideColorRight />
          <QuotedMsgRightStyled>
            {!message.quotedMsg?.fromMe && (
              <MessageContactNameStyled>
                {message.quotedMsg?.contact?.name}
              </MessageContactNameStyled>
            )}
            {message.quotedMsg?.body}
          </QuotedMsgRightStyled>
        </QuotedContainerRightStyled>
        ): (
        <QuotedContainerLeftStyled>
          <QuotedSideColorLeft />
          <QuotedMsgStyled>
            {!message.quotedMsg?.fromMe && (
              <MessageContactNameStyled>
                {message.quotedMsg?.contact?.name}
              </MessageContactNameStyled>
            )}
            {message.quotedMsg?.body}
          </QuotedMsgStyled>
        </QuotedContainerLeftStyled>
        )
      </>
    );
  };

  const renderMessages = () => {
    if (messagesList.length > 0) {
      const viewMessagesList = messagesList.map((message, index) => {
        if (!message.fromMe) {
          return (
            <React.Fragment key={message.id}>
              {renderDailyTimestamps(message, index)}
              {renderMessageDivider(message, index)}
              <MessageLeftStyled>
                <MessageActionsButtonStyled
                  size="small"
                  id="messageActionsButton"
                  disabled={message.isDeleted}
                  onClick={(e) => handleOpenMessageOptionsMenu(e, message)}
                >
                  <ExpandMore />
                </MessageActionsButtonStyled>
                {isGroup && (
                  <MessageContactNameStyled>
                    {message.contact?.name}
                  </MessageContactNameStyled>
                )}
                {(message.mediaUrl ||
                  message.mediaType === "location" ||
                  message.mediaType === "vcard") &&
                  //|| message.mediaType === "multi_vcard"
                  checkMessageMedia(message)}
                <TextContentItemStyled>
                  {message.quotedMsg && renderQuotedMessage(message)}
                  <MarkdownWrapper>{message.body}</MarkdownWrapper>
                  <TimestampStyled>
                    {format(parseISO(message.createdAt), "HH:mm")}
                  </TimestampStyled>
                </TextContentItemStyled>
              </MessageLeftStyled>
            </React.Fragment>
          );
        } else {
          return (
            <React.Fragment key={message.id}>
              {renderDailyTimestamps(message, index)}
              {renderMessageDivider(message, index)}
              <MessageRightStyled>
                <MessageActionsButtonStyled
                  size="small"
                  id="messageActionsButton"
                  disabled={message.isDeleted}
                  onClick={(e) => handleOpenMessageOptionsMenu(e, message)}
                >
                  <ExpandMore />
                </MessageActionsButtonStyled>
                {(message.mediaUrl ||
                  message.mediaType === "location" ||
                  message.mediaType === "vcard") &&
                  //|| message.mediaType === "multi_vcard"
                  checkMessageMedia(message)}
                <TextContentItemStyled isDeleted={message.isDeleted}>
                  {message.isDeleted && (
                    <DeletedIconStyled color="disabled" fontSize="small" />
                  )}
                  {message.quotedMsg && renderQuotedMessage(message)}
                  <MarkdownWrapper>{message.body}</MarkdownWrapper>
                  <TimestampStyled>
                    {format(parseISO(message.createdAt), "HH:mm")}
                    {renderMessageAck(message)}
                  </TimestampStyled>
                </TextContentItemStyled>
              </MessageRightStyled>
            </React.Fragment>
          );
        }
      });
      return viewMessagesList;
    } else {
      return <div>Say hello to your new contact!</div>;
    }
  };

  return (
    <MessagesListWrapperStyled>
      <MessageOptionsMenu
        message={selectedMessage}
        anchorEl={anchorEl}
        menuOpen={messageOptionsMenuOpen}
        handleClose={handleCloseMessageOptionsMenu}
      />
      <MessagesListStyled id="messagesList" onScroll={handleScroll}>
        {messagesList.length > 0 ? renderMessages() : []}
      </MessagesListStyled>
      {loading && (
        <div>
          <CircleLoadingStyled />
        </div>
      )}
    </MessagesListWrapperStyled>
  );
};

export default MessagesList;
