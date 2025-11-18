const sidebars = {
    docsSidebar: [
        'intro',
        {
            type: 'category',
            label: 'Arquitectura',
            collapsed: false,
            items: [
                'arquitectura/general',
                'arquitectura/flujo',
                'arquitectura/tecnologias',
            ],
        },
        {
            type: 'category',
            label: 'Frontend',
            collapsed: false,
            items: [
                'frontend/intro',
                'frontend/estructura',
                'frontend/integracion-api',
                'frontend/vistas-pago',
                'frontend/responsive',
                'frontend/autenticacion',
            ],
        },
        {
            type: 'category',
            label: 'Backend',
            collapsed: false,
            items: [
                'backend/intro',
                'backend/estructura',
                'backend/instancias',
                'backend/usuarios-planes',
                'backend/planes',
                'backend/mercadopago',
                'backend/login',
                'backend/google-auth',
                'backend/endpoints',
            ],
        },
        {
            type: 'category',
            label: 'Despliegue',
            collapsed: false,
            items: [
                'despliegue/docker',
                'despliegue/produccion',
            ],
        },
        'contribuir',
    ],
};

export default sidebars;