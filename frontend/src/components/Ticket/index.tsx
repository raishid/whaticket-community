import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import openSocket from "../../services/socket-io";
import Paper from "@mui/material/Paper";

import ContactDrawer from "../ContactDrawer";
import MessageInput from "../MessageInput/";
import TicketHeader from "../TicketHeader";
import TicketInfo from "../TicketInfo";
import TicketActionButtons from "../TicketActionButtons";
import MessagesList from "../MessagesList";
import api from "../../services/api";
import { ReplyMessageProvider } from "../../context/ReplyingMessage/ReplyingMessageContext";
import toastError from "../../errors/toastError";
import type { Error } from "../../types/Error";
import { styled } from "@mui/material/styles";

const drawerWidth = 320;

const RootStyled = styled("div", {
  name: "TicketRootStyled",
})({
  display: "flex",
  height: "100%",
  position: "relative",
  overflow: "hidden",
});

const TicketInfoStyled = styled("div")(({ theme }) => ({
  maxWidth: "50%",
  flexBasis: "50%",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "80%",
    flexBasis: "80%",
  },
}));

const TicketActionButtonsStyled = styled("div")(({ theme }) => ({
  maxWidth: "50%",
  flexBasis: "50%",
  display: "flex",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
    flexBasis: "100%",
    marginBottom: "5px",
  },
}));

interface MainWrapperStyledProps {
  drawOpen: boolean;
}

const MainWrapperStyled = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "drawOpen",
})<MainWrapperStyledProps>(({ theme, drawOpen }) => {
  if (drawOpen) {
    return {
      flex: 1,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderLeft: "0",
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    };
  }

  return {
    flex: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeft: "0",
    marginRight: -drawerWidth,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  };
});

const Ticket = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  interface Contact {
    id: number;
    name?: string;
    email?: string;
    phoneNumber?: string;
    // Add other properties as needed
  }

  const [contact, setContact] = useState<Contact>({ id: 0 });
  const [ticket, setTicket] = useState({} as any);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchTicket = async () => {
        try {
          const { data } = await api.get("/tickets/" + ticketId);

          setContact(data.contact);
          setTicket(data);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          toastError(err as Error);
        }
      };
      fetchTicket();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [ticketId]);

  useEffect(() => {
    const socket = openSocket();

    socket.on("connect", () => socket.emit("joinChatBox", ticketId));

    socket.on("ticket", (data) => {
      if (data.action === "update") {
        setTicket(data.ticket);
      }

      if (data.action === "delete") {
        toast.success("Ticket deleted sucessfully.");
        navigate("/tickets");
      }
    });

    socket.on("contact", (data) => {
      if (data.action === "update") {
        setContact((prevState) => {
          if (prevState.id === data.contact?.id) {
            return { ...prevState, ...data.contact };
          }
          return prevState;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [ticketId]);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <RootStyled id="drawer-container">
      <MainWrapperStyled variant="outlined" elevation={0} drawOpen={drawerOpen}>
        <TicketHeader loading={loading}>
          <TicketInfoStyled>
            <TicketInfo
              contact={contact}
              ticket={ticket}
              onClick={handleDrawerOpen}
            />
          </TicketInfoStyled>
          <TicketActionButtonsStyled>
            <TicketActionButtons ticket={ticket} />
          </TicketActionButtonsStyled>
        </TicketHeader>
        <ReplyMessageProvider>
          <MessagesList
            ticketId={ticketId}
            isGroup={ticket?.isGroup}
          ></MessagesList>
          <MessageInput ticketStatus={ticket.status} />
        </ReplyMessageProvider>
      </MainWrapperStyled>
      <ContactDrawer
        open={drawerOpen}
        handleDrawerClose={handleDrawerClose}
        contact={contact}
        loading={loading}
      />
    </RootStyled>
  );
};

export default Ticket;
