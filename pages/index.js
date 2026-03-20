export default function Home() {

  const generate = () => {
    window.open("/api/generate");
  };

  return (
    <div style={{padding:"40px",fontFamily:"Arial"}}>
      <h1>VB Hành Chính</h1>
      <button onClick={generate}>
        Tạo hợp đồng mẫu
      </button>
    </div>
  );
}
