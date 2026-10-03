# Política de devoluciones y reembolsos · texto para Shopify

> **HISTÓRICO · no describe el estado actual.** Se conserva como registro y lección aprendida. El sistema vigente está en `docs/garelon/` (Prompt Maestro, Master Template, brief, prompt de migración, checklist, registro de decisiones) y el estado real en `.claude/skills/garelon-ecommerce-operator/references/current-store-state.md`. Ante cualquier contradicción manda el repositorio actual.

Dónde se pega: **Shopify Admin → Configuración → Políticas → Política de reembolso**.
Es la opción recomendada, porque Shopify la publica en `/policies/refund-policy` con el diseño del theme. También la enlaza en el pie de página (el theme la muestra como «Política de devoluciones y reembolsos») y en el checkout.

## Antes de pegar: 3 comprobaciones

1. **Gastos de devolución por desistimiento (decisión tuya).** El texto usa la regla legal por defecto: los paga el cliente, salvo que le indiques otra cosa. Si prefieres pagarlos tú, cambia esa frase por: «GARELON asumirá los gastos de devolución.»
2. **Enlace a contacto.** El texto enlaza a `/pages/contact`. Si la URL de tu página de contacto es otra (Tienda online → Páginas → Contacto → «Ver»), cámbiala en el HTML. También puedes seleccionar el texto en el editor y elegir la página con el botón de enlace.
3. **Datos legales.** El formulario de desistimiento remite a los datos de la tienda. Asegúrate de que las políticas **Información de contacto** y **Aviso legal** tienen tu nombre o razón social, NIF, dirección y email reales. El theme no los inventa.

## Cómo pegarlo

1. Configuración → Políticas → **Política de reembolso**.
2. En el editor pulsa el botón **`<>` (Mostrar HTML)**.
3. Borra lo que haya y pega el bloque HTML de abajo.
4. **Guardar**.

Shopify pone el título de la página (en español, «Política de reembolso») y no se puede cambiar. En el pie de página el enlace aparece como «Política de devoluciones y reembolsos».

## HTML para pegar

```html
<p>En GARELON queremos que compres con tranquilidad. En esta página te explicamos cómo devolver un pedido si cambias de opinión, qué hacer si llega dañado o no es correcto, qué pasa si no lo recibes y cómo gestionamos los reembolsos.</p>
<p>Esta política se aplica a las compras realizadas por consumidores en nuestra tienda online y no limita en ningún caso los derechos que te reconoce la normativa de consumo española y europea.</p>

<h2>1. Cómo iniciar una solicitud</h2>
<p>Cualquier solicitud (desistimiento, incidencia o reembolso) se inicia desde nuestra <a href="/pages/contact" title="Contacto">página de contacto</a>. Para poder ayudarte rápido, indícanos:</p>
<ul>
<li>Tu nombre y apellidos.</li>
<li>El número de pedido.</li>
<li>El correo electrónico que utilizaste al comprar.</li>
<li>El motivo de tu solicitud.</li>
</ul>
<p>Si se trata de un producto dañado, defectuoso o incorrecto, podremos pedirte una fotografía o un vídeo que nos ayude a documentar la incidencia.</p>
<p><strong>Antes de realizar cualquier envío de devolución, ponte en contacto con nuestro equipo.</strong> Te facilitaremos las instrucciones correspondientes para tu caso. Las devoluciones enviadas sin autorización previa podrían no poder ser identificadas o procesadas correctamente.</p>

<h2>2. Si cambias de opinión: derecho de desistimiento</h2>
<p>Puedes desistir de tu compra, sin necesidad de indicar el motivo, en un plazo de <strong>14 días naturales</strong> desde el día en que tú, o una persona que indiques (distinta del transportista), recibáis el producto. Si tu pedido llega en varios envíos, el plazo empieza a contar desde la recepción del último.</p>
<p><strong>Cómo ejercerlo.</strong> Basta con que nos comuniques tu decisión antes de que termine el plazo, a través de nuestra <a href="/pages/contact" title="Contacto">página de contacto</a>. Puedes usar el formulario modelo que encontrarás al final de esta página, aunque no es obligatorio.</p>
<p><strong>Devolución del producto.</strong> Cuando recibamos tu solicitud, te enviaremos las instrucciones para devolver el producto. Deberás enviarlo sin demoras indebidas y, como máximo, en los 14 días naturales siguientes a la fecha en que nos comuniques tu decisión.</p>
<p><strong>Gastos de devolución.</strong> Los costes directos de devolución del producto corren a tu cargo, salvo que te indiquemos otra cosa en las instrucciones.</p>
<p><strong>Estado del producto.</strong> Puedes examinar el producto como lo harías en una tienda física. Solo serás responsable de la disminución de su valor si se debe a una manipulación distinta de la necesaria para comprobar su naturaleza, sus características y su funcionamiento.</p>
<p><strong>Productos precintados.</strong> De acuerdo con el artículo 103.e) del Texto Refundido de la Ley General para la Defensa de los Consumidores y Usuarios, el derecho de desistimiento no se aplica a los bienes precintados que no sean aptos para ser devueltos por razones de protección de la salud o de higiene y que hayan sido desprecintados tras la entrega. Si tu caso pudiera estar en esta situación, te lo indicaremos al revisar tu solicitud. Esta excepción nunca afecta a los productos defectuosos, dañados o incorrectos.</p>

<h2>3. Producto defectuoso, dañado o incorrecto</h2>
<p>Esto no es un cambio de opinión: si tu pedido llega dañado, con un defecto o no corresponde con lo que compraste, <a href="/pages/contact" title="Contacto">escríbenos</a> en cuanto lo detectes indicando tu número de pedido. Si es posible, conserva el producto y su embalaje, y no utilices un producto que haya llegado dañado o con el envase deteriorado.</p>
<p>Cuando sea razonablemente necesario, te pediremos una fotografía o un vídeo del producto y del embalaje. Una vez revisado, GARELON te propondrá la solución que corresponda según la garantía legal de conformidad, como la sustitución por un producto correcto o, cuando proceda, el reembolso. Estas soluciones no tienen coste para ti: si fuera necesario que nos devuelvas el producto, te daremos las instrucciones y no tendrás que asumir los gastos de envío.</p>
<p>Recuerda que la garantía legal de los productos es de tres años desde la entrega, tal y como establece la normativa de consumo.</p>

<h2>4. Pedido no recibido</h2>
<p>Si tu pedido no ha llegado dentro del plazo indicado, o el seguimiento muestra una incidencia, contacta con nuestro equipo desde la <a href="/pages/contact" title="Contacto">página de contacto</a> con tu número de pedido. Revisaremos el seguimiento del envío y te ayudaremos a resolverlo, con un nuevo envío o con el reembolso, según el caso.</p>
<p>Si el seguimiento indica que el pedido se ha entregado pero no lo has recibido, avísanos lo antes posible para que podamos investigarlo. Hasta que recibes el pedido, su transporte es responsabilidad nuestra.</p>

<h2>5. Reembolsos</h2>
<p>Una vez aprobado el reembolso, lo realizaremos utilizando el mismo método de pago que usaste en la compra, salvo que acuerdes expresamente con nosotros otro distinto. El reembolso no tendrá ningún coste para ti.</p>
<p>Si desistes de tu compra, te reembolsaremos el importe pagado, incluidos los gastos de envío estándar (no el coste adicional de una modalidad de envío más cara que hayas elegido). Lo haremos sin demoras indebidas y, como máximo, en 14 días naturales desde que nos comuniques tu decisión. Podemos esperar a recibir el producto, o a que nos envíes una prueba de su devolución, antes de emitir el reembolso.</p>
<p>El tiempo que tarda el importe en aparecer en tu cuenta depende de tu banco o de tu proveedor de pago.</p>

<h2>6. Formulario de desistimiento</h2>
<p>Solo tienes que completarlo y enviárnoslo si deseas desistir del contrato. Puedes copiarlo en tu mensaje a través de la <a href="/pages/contact" title="Contacto">página de contacto</a>.</p>
<p><em>Modelo de formulario de desistimiento</em></p>
<p>A la atención de GARELON (datos de contacto y dirección indicados en nuestra información de contacto y aviso legal):</p>
<p>Por la presente le comunico/comunicamos (*) que desisto de mi/desistimos de nuestro (*) contrato de venta del siguiente bien (*):<br>
Pedido el / recibido el (*):<br>
Número de pedido:<br>
Nombre del consumidor o de los consumidores:<br>
Domicilio del consumidor o de los consumidores:<br>
Firma del consumidor o de los consumidores (solo si el presente formulario se presenta en papel):<br>
Fecha:</p>
<p>(*) Táchese lo que no proceda.</p>

<h2>7. ¿Tienes dudas?</h2>
<p>Si tienes cualquier pregunta sobre esta política o sobre tu pedido, escríbenos desde nuestra <a href="/pages/contact" title="Contacto">página de contacto</a>. Estaremos encantados de ayudarte.</p>
```

## Notas

- La política no menciona a ningún proveedor ni publica direcciones de devolución: GARELON gestiona cada caso y da las instrucciones de envío cuando corresponde.
- Base legal: Real Decreto Legislativo 1/2007 (TRLGDCU), artículos 102 a 108 (desistimiento) y 114 y siguientes (garantía de conformidad). Es un texto de referencia prudente, **no asesoramiento jurídico**. Si puedes, pide a un profesional que lo revise junto con tu Aviso legal.
