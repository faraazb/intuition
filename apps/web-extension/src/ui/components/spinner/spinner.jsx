import "./spinner.scss";

const DEFAULT_CLASS = "loading-spinner";

export const Spinner = ({ className, alt = "Loading..." }) => {
  const classes = className ? `${DEFAULT_CLASS} ${className}` : DEFAULT_CLASS;

  return (
    <img
      className={classes}
      alt={alt}
      aria-busy="true"
      aria-live="polite"
      src="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20xmlns%3Asketch%3D%22http%3A%2F%2Fwww.bohemiancoding.com%2Fsketch%2Fns%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%2024%2024%22%20version%3D%221.1%22%20data-ember-extension%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20x1%3D%2228.1542969%25%22%20y1%3D%2263.7402344%25%22%20x2%3D%2274.6289062%25%22%20y2%3D%2217.7832031%25%22%20id%3D%22linearGradient-1%22%3E%3Cstop%20stop-color%3D%22rgba(164%2C%20164%2C%20164%2C%201)%22%20offset%3D%220%25%22%2F%3E%3Cstop%20stop-color%3D%22rgba(164%2C%20164%2C%20164%2C%200)%22%20stop-opacity%3D%220%22%20offset%3D%22100%25%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Cg%20id%3D%22Page-1%22%20stroke%3D%22none%22%20stroke-width%3D%221%22%20fill%3D%22none%22%20%3E%3Cg%20transform%3D%22translate(-236.000000%2C%20-286.000000)%22%3E%3Cg%20transform%3D%22translate(238.000000%2C%20286.000000)%22%3E%3Ccircle%20id%3D%22Oval-2%22%20stroke%3D%22url(%23linearGradient-1)%22%20stroke-width%3D%224%22%20cx%3D%2210%22%20cy%3D%2212%22%20r%3D%2210%22%2F%3E%3Cpath%20d%3D%22M10%2C2%20C4.4771525%2C2%200%2C6.4771525%200%2C12%22%20id%3D%22Oval-2%22%20stroke%3D%22rgba(164%2C%20164%2C%20164%2C%201)%22%20stroke-width%3D%224%22%2F%3E%3Crect%20id%3D%22Rectangle-1%22%20fill%3D%22rgba(164%2C%20164%2C%20164%2C%201)%22%20x%3D%228%22%20y%3D%220%22%20width%3D%224%22%20height%3D%224%22%20rx%3D%228%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
    ></img>
  );
};
