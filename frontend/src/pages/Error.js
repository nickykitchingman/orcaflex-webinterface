import { useRouteError } from "react-router-dom";

const internalError = error => (
   <div id="error-page">        
        <h1>Error.</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
            <i>{error.statusText || error.message}</i>
        </p>
    </div>
);

export function BoundaryError({error, resetErrorBoundary}) {
  console.error(error);
  return internalError(error);
}

export function RouterError() {
  const error = useRouteError();
  console.error(error);
  return internalError(error);
}