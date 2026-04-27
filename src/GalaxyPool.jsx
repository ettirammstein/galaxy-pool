const GACHA_CONTRACT = "babloweb4.near";
const { accountId } = context;

const spin = () => {
  Near.call(GACHA_CONTRACT, "request_spin", {}, "300000000000000");
};

// Простой стиль через styled-components (в BOS доступны стандартно)
const Wrapper = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 90vh; background: #000; color: #fff;
`;

return (
  <Wrapper>
    <h1 style={{ color: "#06b6d4" }}>GALAXY POOL</h1>
    <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "#06b6d4", boxShadow: "0 0 40px #06b6d4" }}></div>
    <button onClick={spin} style={{ marginTop: "40px", padding: "15px 30px", borderRadius: "20px", border: "none", background: "#fff" }}>
      БАБЛО
    </button>
  </Wrapper>
);
