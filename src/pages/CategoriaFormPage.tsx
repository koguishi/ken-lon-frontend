import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Pessoa as Categoria } from "../types";
import CategoriaForm from "../components/CategoriaForm";
import DashboardLayout from "../components/DashboardLayout";
import { CategoriaApi } from "../api/CategoriaApi";
import { ROUTES } from "../Routes";

export default function CategoriaFormPage() {
  const { id } = useParams<{ id: string }>();
  const [categoria, setCategoria] = useState<Categoria | undefined>(undefined);
  const navigate = useNavigate();

  const { getById } = CategoriaApi;

  if (id) {
    useEffect(() => {
      getById(id!).then((res) => {
        setCategoria(res.data);
      }).catch(err => console.error(err));
    }, [id]);
  }

  const handleSave = () => {
    navigate(ROUTES.categorias); // volta para listagem após salvar
  };

  return(
    <DashboardLayout>
      <CategoriaForm categoria={categoria} onSave={handleSave} onCancel={() => navigate(ROUTES.categorias)} />
    </DashboardLayout>
  );
}
