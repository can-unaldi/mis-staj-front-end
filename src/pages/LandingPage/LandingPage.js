import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import StarIcon from "@mui/icons-material/StarBorder";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import internImg from "../../public/intern.png";
import Divider from "@mui/material/Divider";
import { ThemeProvider } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

import {
  createStyles,
  Image,
  // Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

// import { Check } from "tabler-icons-react";
// import image from "./image.svg";
import { Check } from "@mui/icons-material";
const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 4,
  },

  content: {
    maxWidth: 480,
    marginRight: theme.spacing.xl * 3,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 44,
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan("xs")]: {
      fontSize: 28,
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  highlight: {
    position: "relative",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.55)
        : theme.colors[theme.primaryColor][0],
    borderRadius: theme.radius.sm,
    padding: "4px 12px",
  },
}));
function Copyright(props) {
  return (
    <>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright ?? "}
        <Link color="inherit" href="https://mis-staj-prod.web.app/">
          Can ??nald?? & Emre G??r
        </Link>{" "}
        {new Date().getFullYear()}
        MIS 492.03 dersi i??in bitirme projesi kapsam??nda geli??tilmi??tir.
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        MIS 492.03 dersi i??in bitirme projesi kapsam??nda geli??tilmi??tir.
      </Typography>
    </>
  );
}

const tiers = [
  {
    title: "????renciler ????in",
    description:
      "E-Staj uygulamas??na ??ifreniz ile girerek staj ba??vurusu yapabilir, ba??vuru yapt??????n??z stajlar??n??z??n s??recinin ne durumda oldu??unu g??rebilirsiniz.Ge??mi?? stajlar??n??z da t??m detaylar??yla elinizin alt??nda!",
    buttonText: "Sign up for free",
    buttonVariant: "outlined",
  },
  {
    title: "Dan????manlar ????in",
    description:
      "E-Staj uygulamas??na ??ifreniz ile girerek staj ba??vurusu yapabilir, ba??vuru yapt??????n??z stajlar??n??z??n s??recinin ne durumda oldu??unu g??rebilirsiniz.Ge??mi?? stajlar??n??z da t??m detaylar??yla elinizin alt??nda!",

    buttonText: "Get started",
    buttonVariant: "contained",
  },
  {
    title: "Staj Sorumlular?? ve Koordinator",
    description:
      "Dan????manlar taraf??ndan onaylanm???? t??m ba??vurular?? Hesap ????lerine ileterek s??reci h??zland??rabilirsiniz. ????renciye ve ba??vuruya dair t??m ayr??nt??lara ula??mak birka?? t??k uza????n??zda.",
  },
  {
    title: "??irketler ????in",
    description:
      "Stajyer aday??n??z??n ba??vurusunun ilerletilmesi i??in gereken d??k??man?? sistem ??zerinden gelecek mail ile doldurabilir, adaya iletebilirsiniz.",
  },
  {
    title: "B??l??m Yetkilileri ????in",
    description:
      "Sistem ??zerinden ????rencinin staj yapabilece??ine dair onay verebilir, gerekli d??k??manlar?? inceleyebilirsiniz.",
  },
];

function LandingPageContent() {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Mis E-Staj
          </Typography>

          <Button href="/signin" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
            Giri??
          </Button>
        </Toolbar>
      </AppBar>
      {/* Hero unit */}
      <div>
        <Container>
          <div className={classes.inner}>
            <div className={classes.content}>
              <Title className={classes.title}>
                Mis <span className={classes.highlight}>E-Staj</span>'a <br />{" "}
                Ho?? Geldiniz.
              </Title>
              <Text color="dimmed" mt="md">
                MIS E-Staj, ????rencilerin tamamlamas?? gereken stajlar?? i??in
                gereken t??m ad??mlar?? dijital ortama aktararak kolayla??t??rmay??
                hedefleyen bir sistemdir.
              </Text>

              <List
                mt={30}
                spacing="sm"
                size="sm"
                icon={
                  <ThemeIcon size={20} radius="xl">
                    <Check size={12} />
                  </ThemeIcon>
                }
              >
                <List.Item>
                  <b>Ba??vuru S??reci</b> ??? Staj ba??vurusu, ??irket onay?? gibi t??m
                  a??amalar?? sistem ??zerinden yapabilir
                </List.Item>
                <List.Item>
                  <b>Yetkili Onay??</b> ??? Sistemi kullanan dan????man??n??z ve b??l??m
                  yetkililerince onay alabilir
                </List.Item>
                <List.Item>
                  <b>Belge Teslimi</b> ??? Staj sonras?? teslim etmeniz gereken
                  belgeleri de sisteme y??kleyerek koordinat??r onay??na
                  sunabilirsiniz.
                </List.Item>
              </List>

              <Group mt={30}>
                <Button
                  onClick={() => navigate("/home")}
                  radius="xl"
                  size="md"
                  className={classes.control}
                >
                  Giri??
                </Button>
                <Button
                  variant="default"
                  radius="xl"
                  size="md"
                  className={classes.control}
                  onClick={() => navigate("/home")}
                >
                  Staj S??reci
                </Button>
              </Group>
            </div>
            <Image src={internImg} className={classes.image} />
          </div>
        </Container>
      </div>
      {/* End hero unit */}
      <Container maxWidth="md">
        <Grid alignItems="center">
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            component="p"
          >
            Nas??l Kullan??l??r?
          </Typography>
          <div>
            {tiers.map((tier) => (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>{tier.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{tier.description}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </Grid>
      </Container>
      {/* Footer */}
      <Container
        maxWidth="md"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}
      >
        <Copyright sx={{ mt: 5 }} />
      </Container>
      {/* End footer */}
    </ThemeProvider>
  );
}

export default function LandingPage() {
  return <LandingPageContent />;
}
