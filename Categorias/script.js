document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. SELECTOR DE UBICACIÓN & FILTRADO COMBINADO
    // ==========================================
    const selectorUbicacion = document.getElementById("select-ubicacion");
    const selectorBuscador = document.getElementById("buscar");
    const tarjetas = document.querySelectorAll(".tarjeta-negocio, .card-negocio");
    const cartelSinResultados = document.getElementById("sin-resultados");

    // Sincronización del selector HTML con localStorage
    if (selectorUbicacion) {
        const ubicacionGuardada = localStorage.getItem("nidox_ubicacion") || "todas";
        selectorUbicacion.value = ubicacionGuardada;

        selectorUbicacion.addEventListener("change", function () {
            localStorage.setItem("nidox_ubicacion", this.value);
            aplicarFiltros();
        });
    }

    // Escuchar tipeo en la barra de búsqueda
    if (selectorBuscador) {
        selectorBuscador.addEventListener("input", aplicarFiltros);
    }

    // Función principal para filtrar tarjetas
    function aplicarFiltros() {
        const textoBusqueda = selectorBuscador ? selectorBuscador.value.toLowerCase().trim() : "";
        // Lee directamente la ubicación almacenada en la memoria local
        const ubicacionElegida = (localStorage.getItem("nidox_ubicacion") || "todas").toLowerCase();

        let contadorVisibles = 0;

        tarjetas.forEach(tarjeta => {
            const contenidoTexto = tarjeta.innerText.toLowerCase();
            const categoria = (tarjeta.getAttribute("data-categoria") || "").toLowerCase();
            const ubicacionTarjeta = (tarjeta.getAttribute("data-ubicacion") || "").toLowerCase();

            // Valida el filtro por palabra clave / texto
            const coincideTexto = contenidoTexto.includes(textoBusqueda) || categoria.includes(textoBusqueda);
            
            // Valida si la ubicación coincide estrictamente (sin excepciones por vacío)
            const coincideUbicacion = (ubicacionElegida === "todas" || ubicacionTarjeta === ubicacionElegida);

            if (coincideTexto && coincideUbicacion) {
                tarjeta.style.display = ""; // Mantiene los estilos del Grid/Flex
                setTimeout(() => tarjeta.style.opacity = "1", 10);
                contadorVisibles++;
            } else {
                tarjeta.style.opacity = "0";
                tarjeta.style.display = "none";
            }
        });

        // Control del mensaje sin resultados
        if (cartelSinResultados) {
            if (contadorVisibles === 0) {
                cartelSinResultados.style.display = "block";
                setTimeout(() => cartelSinResultados.style.opacity = "1", 10);
            } else {
                cartelSinResultados.style.opacity = "0";
                cartelSinResultados.style.display = "none";
            }
        }
    }

    // Ejecución inicial automática al cargar la página
    aplicarFiltros();


    // ==========================================
    // 2. BORDER GLOW (EFECTO CURSOR EN TARJETAS)
    // ==========================================
    const interactiveCards = document.querySelectorAll('.card, .paso, .beneficio, .card-negocio, .tarjeta-negocio');
    
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });


    // ==========================================
    // 3. SCROLL REVEAL (APARICIÓN DE SECCIONES)
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const secciones = document.querySelectorAll('.presentacion, .funciona, .beneficios, .categorias, .negocios, .cta, .hero-gastronomia, .buscador');
    
    secciones.forEach(sec => {
        sec.classList.add('reveal-effect');
        revealOnScroll.observe(sec);
    });


    // ==========================================
    // 4. HEADER INTELIGENTE
    // ==========================================
    let lastScrollTop = 0;
    const header = document.querySelector('header, .header');

    if (header) {
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, { passive: true });
    }
});


// ==========================================
// 5. ENLACE DIRECTO A WHATSAPP
// ==========================================
function abrirWhatsApp(numero) {
    const mensaje = "Holaa!! Encontré tu negocio en Nidox y me gustaría recibir más información.";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}