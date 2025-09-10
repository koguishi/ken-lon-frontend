export const ROUTES = {
    pessoas: "/pessoas",
    pessoaNovo: "/pessoas/novo",
    pessoaDetalhe: {
        path: "/pessoas/:id",                   // usado no <Route />
        build: (id: string) => `/pessoas/${id}` // usado no navigate()
    },
    categorias: "/categorias",
    categoriaNovo: "/categorias/novo",
    categoriaEditar: (id: string) => `/categorias/editar/${id}`,
    login: "/login",
    selfRegister: "/self-register",
    dashboard: "/dashboard",
};
