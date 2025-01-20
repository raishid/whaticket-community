import { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid2 as Grid,
  Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";

import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";

import { styled } from "@mui/material/styles";

import { i18n } from "../../translate/i18n";

import { AuthContext } from "../../context/Auth/AuthContext";

// const Copyright = () => {
// 	return (
// 		<Typography variant="body2" color="textSecondary" align="center">
// 			{"Copyleft "}
// 			<Link color="inherit" href="https://github.com/canove">
// 				Canove
// 			</Link>{" "}
// 			{new Date().getFullYear()}
// 			{"."}
// 		</Typography>
// 	);
// };

const PaperStyled = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const AvatarStyled = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
}));

const FormStyled = styled("form")(({ theme }) => ({
  width: "100%", // Fix IE 11 issue.
  marginTop: theme.spacing(1),
}));

const SubmitStyled = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const { handleLogin } = useContext(AuthContext);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (handleLogin) {
      handleLogin(user);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <PaperStyled>
        <AvatarStyled>
          <LockOutlined />
        </AvatarStyled>
        <Typography component="h1" variant="h5">
          {i18n.t("login.title")}
        </Typography>
        <FormStyled noValidate onSubmit={handlSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label={i18n.t("login.form.email")}
            name="email"
            value={user.email}
            onChange={handleChangeInput}
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label={i18n.t("login.form.password")}
            id="password"
            value={user.password}
            onChange={handleChangeInput}
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((e) => !e)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <SubmitStyled
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            {i18n.t("login.buttons.submit")}
          </SubmitStyled>
          <Grid container>
            <Grid>
              <Link variant="body2" component={RouterLink} to="/signup">
                {i18n.t("login.buttons.register")}
              </Link>
            </Grid>
          </Grid>
        </FormStyled>
      </PaperStyled>
      <Box mt={8}>{/* <Copyright /> */}</Box>
    </Container>
  );
};

export default Login;
