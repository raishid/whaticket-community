import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

import TicketsManager from "../../components/TicketsManager/";
import Ticket from "../../components/Ticket/";

import { i18n } from "../../translate/i18n";
import Hidden from "@mui/material/Hidden";

const ChatContainerStyled = styled("div")(({ theme }) => ({
  flex: 1,
  // // backgroundColor: "#eee",
  // padding: theme.spacing(4),
  height: `calc(100% - 48px)`,
  overflowY: "hidden",
  backgroundColor: theme.palette.background.default,
}));

const ChatPapperStyled = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100%",
  backgroundColor: theme.palette.background.paper,
}));

const ContactsWrapperSmallStyled = styled(Grid)(({ theme }) => ({
  display: "flex",
  height: "100%",
  flexDirection: "column",
  overflowY: "hidden",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const MessagessWrapperStyled = styled(Grid)({
  display: "flex",
  height: "100%",
  flexDirection: "column",
});

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
        <Grid container spacing={0}>
          {/* <Grid item xs={4} className={classes.contactsWrapper}> */}
          {ticketId ? (
            <ContactsWrapperSmallStyled
              size={{
                xs: 12,
                md: 4,
              }}
            />
          ) : (
            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <TicketsManager />
            </Grid>
          )}

          <MessagessWrapperStyled
            size={{
              xs: 12,
              md: 8,
            }}
          >
            {/* <Grid item xs={8} className={classes.messagessWrapper}> */}
            {ticketId ? (
              <>
                <Ticket />
              </>
            ) : (
              <>
                {/* @ts-ignore */}
                <Hidden only={["sm", "xs"]}>
                  <WelcomeMsgStyled>
                    {/* <Paper square variant="outlined" className={classes.welcomeMsg}> */}
                    <span>{i18n.t("chat.noTicketMessage")}</span>
                  </WelcomeMsgStyled>
                </Hidden>
              </>
            )}
          </MessagessWrapperStyled>
        </Grid>
      </ChatPapperStyled>
    </ChatContainerStyled>
  );
};

export default Chat;
