import styled from "@emotion/styled";
import { CircularProgress } from "@mui/material";

const LoadingPageContainer = styled("div")({
  display: "grid",
  minHeight: "100vh",
  backgroundColor: "rgb(240, 255, 227)",
});

export const LoadingPage = () => {
  return (
    <LoadingPageContainer>
      <CircularProgress sx={{ alignSelf: "center", margin: "auto" }} />
    </LoadingPageContainer>
  );
};

export default LoadingPage;
