Querida Ana, 

Felicitaciones por tan hermoso trabajo. Como ya te comenté, siempre disfruto ver tus TPs por el esfuerzo que pones en cada uno, por lo mucho que tu codigo refleja tu estilo, por como te esforzas por hacer que cada web sea propia. Este es un gran trabajo del que deberias estar muy orgullosa: esta para mostrar en toda ocasion en que quieras demostrar el inmenso aprendizaje que hiciste a lo largo de este camino. 

A nivel visual, tu web se ve impecable. Como siempre, mantenes el diseño sugerido y le agregas detalles hermosos que hacen que tu web se sienta tuya, no un modelo impersonal. El responsive funciona adecuadamente, asi como los agregados y animaciones. 

A nivel funcionalidades, veo que se cumple en general todo lo que pedimos y hay agregados para hacerla aun mas compleja. Entiendo la frustracion de que no hayan salido algunas de las cositas mas dificiles, pero hiciste un gran intento, especialmente con un codigo tan complejo. Las dos cosas que veo con problemas son la paginacion y el boton de "volver atras". 

Con respecto a la funcion de go back: no esta mal pasar un callback, pero no me parece bien pasarlo a texto para ver que busqueda debemos hacer. Pensa bien que datos deberias tener para poder hacer el go back: si la ultima busqueda fue comic o character, que filtros estaban seleccionados, si habia algo en el input, si es busqueda de un solo elemento o de varios. Esa es la info que deberias tener guardada (en variables globales) y luego pasarle a la funcion goBack.
- Cada vez que el usuario hace una busqueda o hace click en una tarjeta de detalle, guardo esos datos en variables globales: searchType, query, sortBy (esto tendrias que cambiarlo cada vez que se hace una busqueda) y id (al hacer click en una tarjeta de comic o de character)
- Al hacer click en goBack, nos fijamos el valor de esas variables, y en base a ellas hacemos un fetch
- Seguimos con las reglas que ya tenes en tu codigo (si es detalle ejecutamos la funcion de detalle, si es busqueda la de busqueda, etc)

Con respecto al paginado, el mayor problema que veo es que los botones no indican de manera clara si estan deshabilitados o no, lo que va a confundirte a vos como dev y a los usuarios. Dales un estilo muy diferenciado cuando no se puedan usar. Una vez que tengas eso, pensa bien las condiciones que deben cumplir tus botones: cada vez que hago una busqueda, quiero que la pagina vuelva a 0, cada vez que hay menos de 20 elementos en la busqueda, quiero que el boton "proxima pagina" este deshabilitado, etc. 

Actualmente en tu codigo si busco comics pero hago click en el boton "proxima pagina" voy a ver personajes. Por que tu codigo hace eso? Que fetch se esta ejecutando? Segui con atencion el camino que hacen tus funciones para ver por que pasan cosas asi. Si necesitas declarar mas variables globales, no hay problema: estan para eso. Pensa en ellas como pensas en el estado de React: una manera de saber siempre lo que esta pasando en tu aplicacion. 

El select para las opciones de personajes no esta igual que en el modelo: deberia cambiar cuando pasamos de Comics a Personajes (es otro select). En tu caso lo resolviste muy bien, pero hubiera sido bueno que mantuvieras el diseño y funcionalidad propuesta en este caso. 

A nivel codigo, 

Tu HTML esta muy bien. Usas buen las etiquetas semanticas, la accesibilidad esta bien cuidada y aprecio mucho que hayas incluido un form. Hay algunas etiquetas que dejas vacias en el HTML que no corresponden, y codigo comentado, que nunca es recomendable en una entrega (entiendo que lo hiciste para que lo viera y pudiera darte mi opinion sobre lo que hiciste: en esos casos, aclaralo tambien con un comentario)

Usas correctamente SASS, hay muy buena aplicacion de las variables, mixins y anidados, y demostras haber comprendido bien como usarlo. Lamento que no hayas aplicado algo mas de arquitectura: componentizar tu SASS, hacer carpetas para las variables, etc, hace que tu codigo sea mucho mas mantenible y escalable. 

Tu JS esta muy bien. Usas correctamente los conocimientos vistos a lo largo del modulo, tu codigo en general es prolijo y bien funcionalizado. Tenes tendencia a la desprolijidad: muchas cosas que deberian estar en HTML estan en JS, muchos comentarios sueltos por ahi, console log no borrados, y algunas variables innecesarias. Un segundo repaso para dejarlo lo mas prolijo posible habria sido bienvenido, aunque entiendo que el tiempo no jugó a favor. 

Estos son comentarios bastante detallistas: en general el nivel de tu codigo es excelente. 

Con respecto a tu github, se agradece mucho la descripcion <3. Me gusta la calidez del README. Quiza quieras agregarle una descripcion en español. Menciona tambien que el usuario va a tener que tener LiveServer para ejecutarlo en local. 

No veo branches en tu codigo. Si no las hiciste, o las hiciste y las borraste, me cuesta ver como fuiste trabajando y agregando funcionalidades: mantenelas por favor para el proximo TP ya que siempre es una ayuda para mi ver como fueron cambiando las funcionalidades. Tus nombres de commits son impecables. 
 
  ✅ Respeta la consigna
  ✅ Respeta el diseño dado
  ✅ Respeta el funcionamiento
  ✅ Responsive funciona correctamente

  ✅ HTML semántico
  ✅ Código bien indentado
  ✅ Buenos nombres de clases
  ✅ Buenos nombres de funciones y variables
  ✅ Uso de variables (SASS)

  ❌ Buena estructura y separación de archivos (SASS)
  ✅ Correcto uso de estilos anidados (SASS)
  ❌ Nombres de branchs adecuados

  ❌ Componentización de estilos (SASS)
  ✅ Funciones pequeñas
  ✅ Lógica clara y simple
  ✅ Separación clara de manejo de datos y visualización

  ✅ Reutilización de lógica / funciones
  ✅ Commits con mensajes adecuados

Nota final: **9**
