class Campo{
    private nombre: string;
    private productor: Productor;
    private provincia: Provincia;
    private localidad: Localidad;

    getNombre(): string{
        return this.nombre;
    }

    setNombre(nombre: string){
        this.nombre = nombre;
    }
}

