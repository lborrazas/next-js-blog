import { useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import sPlant from "./plant.module.css";
import sSmoke from "./smoke.module.css";
import Co2Icon from "@mui/icons-material/Co2";
import Chip from "@mui/material/Chip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import RedirectPage from "../../components/redirect/RedirectPage";
import { getCsrfToken, useSession } from "next-auth/react";
import Paper from "@mui/material/Paper";
import { Grid, keyframes } from "@mui/material";
import Typography from "@mui/material/Typography";
import { fShortenNumber } from "../../utils/formatNumber";
import { renderToStaticMarkup } from "react-dom/server";
import { Clouds } from "../../assets/svg";

// const BigItem = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#D0F2FF",
//   ...theme.typography.body2,
//   padding: theme.spacing(2),
//   marginTop: theme.spacing(3),
//   textAlign: "center",
//   height: "400px",
//   color: "#04297A",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
// }));
//
// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
//   ...theme.typography.body2,
//   padding: theme.spacing(2),
//   marginTop: theme.spacing(3),
//   textAlign: "left",
//   color: theme.palette.text.secondary,
// }));
//
// const ItemS = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#2b6030",
//   ...theme.typography.body2,
//   padding: theme.spacing(2),
//   marginTop: theme.spacing(3),
//   textAlign: "left",
//   color: theme.palette.text.secondary,
// }));

const expand = keyframes`
  0% {
    height: 20%;
  }
  30% {
    height: 20%;
  }
  70% {
    height: 100%
  }
  100% {
    height: 100%
  }
`;

const retract = keyframes`
  0% {
    height: 80%
  }
  30% {
    height: 80%
  }
  70% {
    height: 0
  }
  100% {
    height: 0
  }
`;

const expandWidth = keyframes`
  0% {
    width: 300px;
    background-color: #ffffff;
    border-radius: 0;
  }
  79% {
    background-color: #ffffff;
  }
  80% {
    width: 300px;
    background-color: #d3eeff;
    border-radius: 0;
  }
  100% {
    width: 100%;
    background-color: #b6e4ff;
    border-radius: 30px;
  }
`;

const removeBackground = keyframes`
  0% {
    background-color: #ffffff;
  }
  79% {
    background-color: #ffffff;
  }
  80% {
    background-color: transparent;
  }
`;

const svgString = encodeURIComponent(renderToStaticMarkup(<Clouds />));

const AnimationContainer = styled("div")({
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  height: "500px",
  borderRadius: "30px",
  overflow: "hidden",
  backgroundImage: `url("data:image/svg+xml,${svgString} ")`,
  animation: `${expandWidth} 10s forwards`,
});

const PlantContainer = styled("div")({
  display: "flex",
  alignItems: "end",
  width: "300px",
  margin: "auto",
  zIndex: 2,
  animation: `${expand} 8s forwards`,
});

const SmokeContainer = styled("div")({
  display: "flex",
  alignItems: "end",
  justifyContent: "center",
  overflow: "hidden",
  animation: `${retract} 8s forwards`,
});

const PlantBox = styled("div")({
  position: "relative",
  display: "block",
  width: "100%",
  height: "100%",
  animation: `${removeBackground} 10s forwards`,
});

const PlantPot = styled("div")({
  position: "absolute",
  width: "100%",
  height: "100px",
  bottom: 0,
  background: "#FCAA67",
  clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
  padding: "0 20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showPlant, setShowPlant] = useState(false);
  const [showSmoke, setShowSmoke] = useState(true);
  const [growAnimation, setGrowAnimation] = useState("");

  const shouldRedirect = !session;

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/login");
    }
  }, [shouldRedirect, router]);

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    session.address ? `/api/co2Data/Admin/total` : null,
    fetcher
  );

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(session.address);
  };

  const handleRain = () => {
    setGrowAnimation(sPlant.rain);
    setShowPlant(true);
    setTimeout(function () {
      setGrowAnimation("");
    }, 1200);
  };

  useEffect(() => {
    setTimeout(() => {
      setShowSmoke(false);
    }, 6000);
    setTimeout(() => {
      handleRain();
    }, 8000);
  }, []);

  return (
    <div>
      {shouldRedirect ? (
        <RedirectPage />
      ) : (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            height: "100%",
            display: "flex",
          }}
        >
          <Grid container spacing={2}>
            <Grid item md={8} sm={12} xs={12}>
              <Typography component="h2" variant="h4">
                {`¡Bienvenido ${session.user.name}!`}
              </Typography>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <Chip
                label={session.address}
                onClick={handleCopyToClipboard}
                icon={<ContentCopyIcon />}
              />
            </Grid>
            <Grid item xs={12}>
              <AnimationContainer>
                <PlantContainer>
                  <PlantBox>
                    {showPlant && (
                      <div className={`${sPlant.stem} ${growAnimation}`}>
                        <div className={`${sPlant.leaf} ${sPlant.leaf01}`}>
                          <div className={`${sPlant.line}`}></div>
                        </div>
                        <div className={`${sPlant.leaf} ${sPlant.leaf02}`}>
                          <div className={`${sPlant.line}`}></div>
                        </div>
                        <div className={`${sPlant.leaf} ${sPlant.leaf03}`}>
                          <div className={`${sPlant.line}`}></div>
                        </div>
                        <div className={`${sPlant.leaf} ${sPlant.leaf04}`}>
                          <div className={`${sPlant.line}`}></div>
                        </div>
                        <div className={`${sPlant.leaf} ${sPlant.leaf05}`}>
                          <div className={`${sPlant.line}`}></div>
                        </div>
                        <div className={`${sPlant.leaf} ${sPlant.leaf06}`}>
                          <div className={`${sPlant.line}`}></div>
                        </div>
                      </div>
                    )}
                    <PlantPot>
                      <Typography
                        align="center"
                        variant="h4"
                        sx={{ fontWeight: "bold" }}
                      >
                        {fShortenNumber(data)}kg
                        <Co2Icon />
                      </Typography>
                      <Typography align="center" variant="h5">
                        contrarrestado
                      </Typography>
                    </PlantPot>
                  </PlantBox>
                </PlantContainer>
                {showSmoke && (
                  <SmokeContainer>
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke2}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke3}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke4}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke5}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke6}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke7}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke8}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke9}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke10}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke11}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke12}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke13}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke14}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke15}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke16}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke17}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke18}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke19}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke20}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke21}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke22}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke23}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke24}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke25}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke26}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke27}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke28}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke29}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke30}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke31}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke32}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke33}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke34}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke35}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke36}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke37}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke38}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke39}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke40}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke41}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke42}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke43}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke44}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke45}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke46}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke47}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke48}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke49}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke50}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke51}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke52}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke53}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke54}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke55}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke56}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke57}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke58}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke59}`} />
                    <div className={`${sSmoke.smoke} ${sSmoke.smoke60}`} />
                  </SmokeContainer>
                )}
              </AnimationContainer>
            </Grid>
          </Grid>
        </Paper>
      )}
    </div>
  );
}
