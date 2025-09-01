import { useState, type JSX } from "react";

interface ContadorProps {
  inicial?: number; // valor inicial opcional
}

export function Contador({ inicial = 0 }: ContadorProps): JSX.Element {
  const [contador, setContador] = useState<number>(inicial);

  return (
    <div style={{ marginTop: "20px" }}>
      <p>Você clicou {contador} vezes</p>
      <button
        onClick={() => setContador(contador + 1)}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "8px",
          border: "1px solid #333",
          backgroundColor: "#61dafb",
        }}
      >
        Clique aqui
      </button>
    </div>
  );
}
