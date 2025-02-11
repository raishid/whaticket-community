import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

import TicketsManager from "../../components/TicketsManager/";
import Ticket from "../../components/Ticket/";

import { i18n } from "../../translate/i18n";

const ChatContainerStyled = styled("div", {
  name: "ChatContainerStyled",
})(({ theme }) => ({
  flex: 1,
  // // backgroundColor: "#eee",
  // padding: theme.spacing(4),
  height: `calc(100% - 48px)`,
  overflowY: "hidden",
  backgroundColor: theme.palette.background.default,
}));

const ChatPapperStyled = styled("div", {
  name: "ChatPapperStyled",
})(({ theme }) => ({
  display: "flex",
  height: "100%",
  backgroundColor: theme.palette.background.paper,
}));

interface ContactsWrapperStyledProps {
  dataTicketId?: string;
}

const ContactsWrapperStyled = styled(Grid, {
  name: "ContactsWrapperStyled",
  shouldForwardProp: (prop) => prop !== "dataTicketId",
})<ContactsWrapperStyledProps>(({ theme, dataTicketId }) => {
  if (dataTicketId) {
    return {
      display: "flex",
      height: "100%",
      flexDirection: "column",
      overflowY: "hidden",
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    };
  }
  return {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    overflowY: "hidden",
  };
});

const MessagessWrapperStyled = styled(Grid, {
  name: "MessagessWrapperStyled",
})(() => ({
  display: "flex",
  height: "100%",
  flexDirection: "column",
}));

const WelcomeMsgStyled = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
  height: "100%",
  textAlign: "center",
  borderRadius: 0,
}));

const Chat = () => {
  const { ticketId } = useParams();

  return (
    <ChatContainerStyled>
      <ChatPapperStyled>
        <Grid
          container
          spacing={0}
          sx={{
            width: "100%",
          }}
        >
          <ContactsWrapperStyled
            size={{
              xs: 12,
              md: 4,
            }}
            dataTicketId={ticketId}
          >
            <TicketsManager />
          </ContactsWrapperStyled>
          <MessagessWrapperStyled
            size={{
              xs: 12,
              md: 8,
            }}
          >
            {ticketId ? (
              <>
                <Ticket />
              </>
            ) : (
              <WelcomeMsgStyled
                sx={{
                  display: {
                    md: "none",
                    xl: "none",
                  },
                }}
              >
                <span>{i18n.t("chat.noTicketMessage")}</span>
              </WelcomeMsgStyled>
            )}
          </MessagessWrapperStyled>
        </Grid>
      </ChatPapperStyled>
    </ChatContainerStyled>
  );
};

export default Chat;
