import { useContext } from "react";

import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import useTickets from "../../hooks/useTickets";

import { AuthContext } from "../../context/Auth/AuthContext";

import { i18n } from "../../translate/i18n";

import Chart from "./Chart";

const ContainerStyled = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const FixedHeightPaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  overflow: "auto",
  flexDirection: "column",
  height: 240,
}));

const CustomFixedHeightPaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  overflow: "auto",
  flexDirection: "column",
  height: 120,
}));

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const user = authContext ? authContext.user : null;
  var userQueueIds: number[] = [];

  if (user.queues && user.queues.length > 0) {
    userQueueIds = user.queues.map((q: any) => q.id);
  }

  const GetTickets = (
    status: string,
    showAll: string,
    withUnreadMessages: string
  ) => {
    const { count } = useTickets({
      status: status,
      showAll: showAll,
      withUnreadMessages: withUnreadMessages,
      queueIds: JSON.stringify(userQueueIds),
    });
    return count;
  };

  return (
    <div>
      <ContainerStyled maxWidth="lg">
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 4,
            }}
          >
            <CustomFixedHeightPaperStyled style={{ overflow: "hidden" }}>
              <Typography component="h3" variant="h6" color="primary" paragraph>
                {i18n.t("dashboard.messages.inAttendance.title")}
              </Typography>
              <Grid>
                <Typography component="h1" variant="h4">
                  {GetTickets("open", "true", "false")}
                </Typography>
              </Grid>
            </CustomFixedHeightPaperStyled>
          </Grid>
          <Grid
            size={{
              xs: 4,
            }}
          >
            <CustomFixedHeightPaperStyled style={{ overflow: "hidden" }}>
              <Typography component="h3" variant="h6" color="primary" paragraph>
                {i18n.t("dashboard.messages.waiting.title")}
              </Typography>
              <Grid>
                <Typography component="h1" variant="h4">
                  {GetTickets("pending", "true", "false")}
                </Typography>
              </Grid>
            </CustomFixedHeightPaperStyled>
          </Grid>
          <Grid
            size={{
              xs: 4,
            }}
          >
            <CustomFixedHeightPaperStyled style={{ overflow: "hidden" }}>
              <Typography component="h3" variant="h6" color="primary" paragraph>
                {i18n.t("dashboard.messages.closed.title")}
              </Typography>
              <Grid>
                <Typography component="h1" variant="h4">
                  {GetTickets("closed", "true", "false")}
                </Typography>
              </Grid>
            </CustomFixedHeightPaperStyled>
          </Grid>
          <Grid
            size={{
              xs: 12,
            }}
          >
            <FixedHeightPaperStyled>
              <Chart />
            </FixedHeightPaperStyled>
          </Grid>
        </Grid>
      </ContainerStyled>
    </div>
  );
};

export default Dashboard;
