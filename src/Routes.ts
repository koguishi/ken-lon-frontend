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
        path: "/categorias/:id",
        build: (id: string) => `/categorias/${id}`
    },
    contasReceber: "/contas-receber",
    contaReceberNovo: "/conta-receber/novo",
    contaReceberDetalhe: {
        path: "/conta-receber/:id",
        build: (id: string) => `/conta-receber/${id}`
    },
    registrarRecebimento: {
        path: "/registrar-recebimento/:id",
        build: (id: string) => `/registrar-recebimento/${id}`
    },
    estornarRecebimento: {
        path: "/estornar-recebimento/:id",
        build: (id: string) => `/estornar-recebimento/${id}`
    },
    fichaFinanceira: "/ficha-financeira",
    login: "/login",
    selfRegister: "/self-register",
    dashboard: "/dashboard",
};
