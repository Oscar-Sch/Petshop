const { createApp } = Vue

createApp({
    data() {
        return {
            articulos:null,
            articulosFiltrados:null,
            // articulosFarmacia:null,
            // articulosJugueteria:null,
            errorCarga:false,
            valorBusqueda:"",
            valorSelector:"",
            listaCarrito:[],
            productoDetalles:null,
            totalCarrito:0,
            envio:"",
            cuotas:"",
            metodoPago:"",
        }
    },
    created(){
        fetch("https://mindhub-xj03.onrender.com/api/petshop")
        .then(res=> res.json())
        .then(res=>{
            this.articulos=this.DetectarPagina(res);
            this.articulosFiltrados=this.articulos;
            if(localStorage.getItem("Carrito")){
                this.listaCarrito= JSON.parse(localStorage.getItem("Carrito"));
                this.articulosFiltrados= this.ActualizarEstadoCarrito();
                console.log(this.articulosFiltrados)
            }
            this.productoDetalles=this.articulos[0];
            console.log(this.listaCarrito)
        })
        // .catch(err=> this.errorCarga=true);
    },
    methods:{
        DetectarPagina(datos){
            const titulo= document.querySelector("h1").innerText;
            if (titulo==="Farmacia"){
                return datos.filter(art=> art.categoria==="farmacia");
            }else
            if(titulo==="Jugueteria"){
                return datos.filter(art=> art.categoria==="jugueteria");
            }else{
                return datos;
            }
        },
        ActualizarEstadoCarrito(){
            return this.articulos.map(arti=>{
                let index= this.listaCarrito.findIndex(prod=>prod.producto===arti.producto);
                if(index>=0){
                    arti.enCarrito=this.listaCarrito[index].enCarrito;
                }
                return arti;
            })
        },
        FiltrarBusqueda(){
            this.articulosFiltrados= this.articulos.filter(art=> art.producto.toLowerCase().includes(this.valorBusqueda.toLowerCase()));

        },
        AgregarAlCarrito(arti){
            let index= this.listaCarrito.findIndex(prod=>prod.producto===arti.producto);
            if (index<0){
                console.log("pusheado")
                arti.enCarrito=1;
                this.listaCarrito.push(arti);
            }else{
                console.log("agregado")
                this.listaCarrito[index].enCarrito++;
            }
            localStorage.setItem("Carrito", JSON.stringify(this.listaCarrito));
            this.articulosFiltrados=this.ActualizarEstadoCarrito();
            console.log(JSON.parse(localStorage.getItem("Carrito")))
        },
        RestarAlCarrito(arti){
            let index= this.listaCarrito.findIndex(prod=>prod.producto===arti.producto);
            this.listaCarrito[index].enCarrito--;
            this.articulosFiltrados=this.ActualizarEstadoCarrito();
            if(this.listaCarrito[index].enCarrito<=0){
                this.listaCarrito.splice(index,1);
            }
            localStorage.setItem("Carrito", JSON.stringify(this.listaCarrito));
            this.articulosFiltrados=this.ActualizarEstadoCarrito();
            console.log(JSON.parse(localStorage.getItem("Carrito")))
        },
        ManejarDetalles(prod){
            this.productoDetalles=prod;
            console.log(this.productoDetalles)
        },
        TotalCarrito(){
            this.totalCarrito=this.listaCarrito.reduce((acu,elem)=>{
                return (acu + (elem.enCarrito*elem.precio));
            },0)
        },
        ManejarPago(){
            switch (this.cuotas) {
                case "1": return (this.totalCarrito +
                    (this.envio==="domicilio"?500:0));
                case "3": return (this.totalCarrito +
                    (this.envio==="domicilio"?500:0))*1.3;
                case "6": return (this.totalCarrito +
                    (this.envio==="domicilio"?500:0))*2;
                case "12": return (this.totalCarrito +
                    (this.envio==="domicilio"?500:0))*2.5;
                default: return (this.totalCarrito +
                    (this.envio==="domicilio"?500:0));
            }
        },
        OrdenarCartas(){
            if(this.valorSelector==="a-z"){
                this.articulosFiltrados.sort((a,b)=>{
                    if (a.pruducto>b.producto){
                        return 1;
                    }
                    if (a.producto<b.producto){
                        return -1;
                    }
                    return 0;
                })
            }
            if(this.valorSelector==="z-a"){
                this.articulosFiltrados.sort((a,b)=>{
                    if (a.pruducto>b.producto){
                        return -1;
                    }
                    if (a.producto<b.producto){
                        return 1;
                    }
                    return 0;
                })
            }
            if(this.valorSelector==="men-may"){
                this.articulosFiltrados.sort((a,b)=>{
                    if (a.precio>b.precio){
                        return 1;
                    }
                    if (a.precio<b.precio){
                        return -1;
                    }
                    return 0;
                })
            }
            if(this.valorSelector==="may-men"){
                this.articulosFiltrados.sort((a,b)=>{
                    if (a.precio>b.precio){
                        return -1;
                    }
                    if (a.precio<b.precio){
                        return 1;
                    }
                    return 0;
                })
            }
        }
    }
}).mount('#app')