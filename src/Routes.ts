export const ROUTES = {
    pessoas: "/pessoas",
    pessoaNovo: "/pessoas/novo",
    pessoaDetalhe: {
        path: "/pessoas/:id",                   // usado no <Route />
        build: (id: string) => `/pessoas/${id}` // usado no navigate()
    },
    categorias: "/categorias",
    categoriaNovo: "/categorias/novo",
    categoriaDetalhe: {
        path: "/categorias/:id",                   // usado no <Route />
        build: (id: string) => `/categorias/${id}` // usado no navigate()
    },
    contasReceber: "/contas-receber",
    contaReceberNovo: "/conta-receber/novo",
    contaReceberDetalhe: {
        path: "/conta-receber/:id",                   // usado no <Route />
        build: (id: string) => `/conta-receber/${id}` // usado no navigate()
    },
    login: "/login",
    selfRegister: "/self-register",
    dashboard: "/dashboard",
};
