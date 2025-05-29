import tomatoe from "../assets/000102401.gif";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "white",
        borderTop: "1px solid #f0f0f0",
        padding: "40px 20px",
        textAlign: "center",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <p>@LAURIS CVETKOVS 2025</p>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#8D8F9A",
            fontWeight: "400",
          }}
        >
          ALL RIGHTS ARE NOT RESERVED
        </p>
      </div>
    </footer>
  );
};

export default Footer;
