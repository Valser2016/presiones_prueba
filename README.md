VERIFICADOR DE PRESIONES VALSER - VERSION OFFLINE

CAMBIOS INCLUIDOS
- El Service Worker precarga la pantalla principal, los módulos Banco y VST, el logo, los iconos y la librería estadística local.
- Los cálculos de distribución t de Student ya no dependen de Cloudflare ni de Internet.
- El servicio de correo EmailJS se carga únicamente cuando se solicita enviar pruebas y requiere conexión.
- Las pruebas aprobadas continúan guardándose en el almacenamiento local del dispositivo.
- Se actualizó la caché a presiones-offline-v5 para reemplazar la versión anterior.

ACTUALIZACIÓN E INSTALACIÓN
1. Publicar el contenido de la carpeta Presiones-main en el mismo alojamiento y ruta donde está publicada la aplicación actual. No cambiar los nombres de los archivos.
2. El sitio debe funcionar mediante HTTPS para que el navegador permita instalar y utilizar el Service Worker.
3. Con el celular conectado a Internet, abrir la aplicación actualizada y esperar a que termine de cargar.
4. Cerrar la aplicación por completo y volverla a abrir. Si no toma la actualización, abrir la dirección en el navegador, recargarla y luego abrir nuevamente el acceso instalado.
5. Hacer una prueba con conexión y después activar modo avión para comprobar Banco, VST 2 y VST 3.

IMPORTANTE
- La primera descarga de esta versión necesita Internet. Después de precargar los archivos, los módulos de cálculo y el logo deben funcionar sin señal.
- El envío de correo requiere Internet. Si no hay conexión, las pruebas aprobadas permanecen guardadas en el dispositivo.
- No borrar los datos del sitio/navegador ni desinstalar la aplicación antes de sincronizar o respaldar las pruebas guardadas.
- Antes de usar en producción, comparar resultados de casos de prueba conocidos con los resultados aprobados por VALSER, especialmente los factores de cobertura y la incertidumbre expandida.
