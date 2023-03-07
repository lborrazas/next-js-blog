import { CircularProgress } from "@mui/material";

import style from "./redirect.module.css";

export const RedirectPage = () => {
  return (
    <div className={style.redirectPage}>
      <div className={style.redirectContent}>
        <p>Redirecting to login page...</p>
        <CircularProgress />
      </div>
    </div>
  );
};

export default RedirectPage;
