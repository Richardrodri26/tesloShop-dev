# Next.js Teslo-shop App
Para correr localmente, se necesita la base de datos

```
docker-compose up -d
```

* El -d,  significa __detached__

## Configurar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__
* MongoDB URL Local:

```
MONGO_URL=mongoDB://localhost:27017/teslodb
```

*Reconstruir los modulos de node y levantar next

```
yarn install
yarn dev
```

## Clonar la base de datos con informacion de prubas

Llamara:
```
http://localhost:3000/api/seed
```