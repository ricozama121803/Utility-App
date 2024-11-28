import { AppBar, Container, Toolbar, Typography } from "@mui/material";

export const NavBar = () => (
  <AppBar
    position="fixed"
    sx={{
      background: (theme) => theme.palette.background.default,
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}
  >
    <Container maxWidth={false}>
      <Toolbar disableGutters={true}>
        <Typography variant="h6" color="primary">
          Developer Utility App
        </Typography>
      </Toolbar>
    </Container>
  </AppBar>
);
