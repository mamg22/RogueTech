import { sprites } from './resources';

export const database_items = [
    {
        id: "pendrive",
        name: "Pendrive",
        image: sprites.items.pendrive,
        description:
`<b> Pendrive </b><br>
Un pendrive es un dispositivo que se conecta al puerto USB de una
 PC u otro aparato eléctrico y nos permite guardar y transferir 
datos de forma rápida y sencilla <br>

Este dispositivo es importante ya que es muy práctico, económico y 
versátil para transportar información.`
    },
    {
        id: 'cd',
        name: "CD",
        image: sprites.items.cd,
        description:
`<b> CD </b><br>
Un CD es un disco óptico que se usa para almacenar información digital
 como música, software, películas, etc. Su nombre significa Compact Disc,
 o Disco Compacto en español.<br>

Fue inventado en 1981 por Sony y Phillips, y estos todos los hemos usado
 desde jóvenes muchas veces en nuestra vida.`
    },
    {
        id: 'gpu',
        name: "Tarjeta gráfica",
        image: sprites.items.gpu,
        description:
`<b> Tarjeta Gráfica</b><br>

Una tarjeta gráfica es un hardware que se encarga de procesar y mostrar los
 gráficos de una pantalla de un ordenador u otro dispositivo. <br>

Sabías que todos los dispositivos con pantalla deben poseer una sin excepción?
 Y estás no siempre son un dispositivo aparte del computador, también pueden
 estar integradas a un chip de procesamiento.
`
    },
    {
        id: 'psu',
        name: "Fuente de poder",
        image: sprites.items.psu,
        description:
`<b> Fuente de poder </b><br>
 
Una fuente de poder es un dispositivo que se encarga de suministrar la energía
 eléctrica necesaria para el funcionamiento de un ordenador o de otro aparato
 electrónico. <br>

Está es muy importante, ya que si está no es adecuada a nuestro dispositivo,
 este no podrá funcionar correctamente.
`
    },
    {
        id: 'hdd',
        name: "Disco duro",
        image: sprites.items.hdd,
        description:
`<b> Disco Duro </b><br>

un disco duro es un dispositivo que permite almacenar información digital de
 forma permanente en una computadora. <br>

La tecnología ha evolucionado tanto que estos fueron la inspiración de la nueva
 generación conocida como disco de estado sólido, muchos más pequeños y
 más rápidos!!
`
    },
    {
        id: 'floppy',
        name: "Disquete",
        image: sprites.items.floppy,
        description:
`<b> Disquete </b><br>

El Disquete fue un dispositivo de almacenamiento de tipo magnético, una reliquia
 tecnológica, este era flexible y delgado protegido por una cubierta de plástico. <br>

Estos fueron los primero dispositivos de almacenamiento creados, y fueron demandados
 hasta 25 años despues de su origen, siendo japon el ultimo pais donde se pararon toda
 su fabricación.<br>

 Quizá lo conozcas como el icono de guardado, pero los disquetes fueron dispositivos
 de almacenamiento muy populares hace un par de décadas. Tenían muy poca capacidad
 comparada con lo que tenemos hoy en día, comúnmente almacenando alrededor de 1.44 MB,
¡Suficiente para almacenar un minuto de música en formato MP3!
`
    },
    {
        id: 'cpu',
        name: "CPU",
        image: sprites.items.cpu,
        description:
`<b> CPU </b><br>

Un CPU es el cebrero de todo equipo que procese datos e información, es un hardware que se encarga
 de ejecutar todas las instrucciones para que la información sea mostrada en pantalla. <br>

Todos los equipos del mundo, celulares, teléfonos, consolas de juego y hasta televisores
 tienen uno propio, increíble no?
`
    },
    {
        id: 'fancooler',
        name: "Fan cooler",
        image: sprites.items.fancooler,
        description:
`<b> Fan Cooler</b><br>

Un fan cooler es un ventilador que se usa para extraer el aire caliente del interior
 de una computadora o de otro dispositivo electrónico, manteniendo así el equipo fresco
 y con un rendimiento aceptable.<br>

Es tan importante ya que la CPU como los microchips generan mucho calor, imagina que no
 se usarán los fan cooler, estos equipos se dañarían súper rápido, además de tener algunas 
luces LED y hacerlos súper llamativos!!
`
    },
    {
        id: 'thermalpaste',
        name: "Pasta Termica",
        image: sprites.items.pastatermica,
        description:
`<b> Pasta Termica </b><br>

La pasta térmica es un compuesto que se usa como conductor de calor entre el CPU o microchips
 junto al disipador de calor también conocido como fan cooler. <br>

A que nunca te has preguntado de que esta hecha la pasta térmica? Pues esta puede ser derivada
 de la silicona, metal, la cerámica o carbono. Incluso existe algo mejor que la pasta termica, 
es el metal liquido, cumple la misma función y hasta mejor!!`
    },
    {
        id: 'ram',
        name: 'RAM',
        image: sprites.items.ram,
        description:
`<b>Memoria RAM</b><br>

La memoria RAM es un tipo de memoria que almacena temporalmente los
datos e instrucciones de los programas que se están ejecutando en
un dispositivo.<br>

La primera memoria ram fue inventada en el año 1947 por John Von Neumann,
un cientifico matematico y de la computacion.<br>

La memoria ram es algo curiosa porque almacena datos e instrucciones mientras
el equipo mientras esta encendido, cuando se apaga todo lo que estaba dentro
se borrará permanentemente.
`
    },
    {
        id: 'antivirus',
        name: 'Antivirus',
        image: sprites.items.antivirus,
        description:
`<b>Antivirus</b><br>

Un antivirus es un programa que se encarga de proteger tu computadora de los
virus y otros tipos de software malicioso que pueden dañarla o robar tu
información.<br>

Se creó en 1971 por el programador Ray Tomlinson, quien también inventó
el sistema de correo electrónico, interesante ¿no?<br>

Lo curioso de los antivirus es que la mayoria estan conectados a una base 
de datos llena de informacion de millones de virus, para asi tener un registro
de los mas antiguos y tener informacion valiosa de los nuevos.
`
    },
    {
        id: 'firewall',
        name: 'Firewall',
        image: sprites.items.firewall,
        description:
`<b>Firewall</b><br>

Un firewall es un sistema que protege tu red o tu dispositivo de accesos no 
autorizados o maliciosos desde Internet.<br>

El primer firewall comercial fue diseñado por Marcus Ranum en 1990. Este bloqueaba
o permitia el acceso a los datos segun su protocolo establecido, era muy seguro
de usar pero complejo de mantener.
`
    }
];
globalThis.d = database_items;