import { navigate } from "./app.js";
import { supabase } from "./supabase.js";

export function WelcomeView(app) {

  app.innerHTML = `
<div class="welcome-screen">

  <div class="welcome-box">

    <!-- ===================== -->
    <!-- TU ERES -->
    <!-- ===================== -->

    <h1 class="welcome-title">
      Tú eres..
    </h1>

    <div class="selection-grid gender-grid">

      <button
        class="select-btn gender-btn"
        data-value="H"
      >
        🧑 Hombre
      </button>

      <button
        class="select-btn gender-btn"
        data-value="M"
      >
        👩 Mujer
      </button>

    </div>

    <!-- ===================== -->
    <!-- BUSCAS -->
    <!-- ===================== -->

    <h2 class="welcome-subtitle">
      ¿A quien queres conocer?
    </h2>

    <div class="selection-grid orientation-grid">

      <button
        class="select-btn target-btn"
        data-value="H"
      >
        ♂️ Hombres
      </button>

      <button
        class="select-btn target-btn"
        data-value="M"
      >
        ♀️ Mujeres
      </button>

    </div>

  </div>

  <!-- ===================== -->
  <!-- BOTON CONTINUAR -->
  <!-- ===================== -->

  <div class="welcome-bottom">

    <button
      id="continueBtn"
      class="continue-btn disabled"
    >
      Continuar
    </button>

  </div>

</div>
  `;

  /* ===================== */
  /* VARIABLES             */
  /* ===================== */

  let sexo = null;

  // ahora pueden coexistir
  let wantsH = false;
  let wantsM = false;

  const continueBtn = document.getElementById("continueBtn");

  const genderBtns = document.querySelectorAll(".gender-btn");
  const targetBtns = document.querySelectorAll(".target-btn");

  /* ===================== */
  /* SEXO (solo uno)       */
  /* ===================== */

  genderBtns.forEach(btn => {

    btn.addEventListener("click", () => {

      genderBtns.forEach(b => b.classList.remove("active"));

      btn.classList.add("active");

      sexo = btn.dataset.value; // H o M

      validate();

    });

  });

  /* ===================== */
  /* ORIENTACION           */
  /* ===================== */

  targetBtns.forEach(btn => {

    btn.addEventListener("click", () => {

      const value = btn.dataset.value;

      // toggle visual
      btn.classList.toggle("active");

      // toggle lógico
      if (value === "H") {
        wantsH = !wantsH;
      }

      if (value === "M") {
        wantsM = !wantsM;
      }

      validate();

    });

  });

  /* ===================== */
  /* VALIDAR               */
  /* ===================== */

  function validate() {

    const hasOrientation =
      wantsH || wantsM;

    if (sexo && hasOrientation) {

      continueBtn.classList.remove("disabled");
      continueBtn.disabled = false;

    } else {

      continueBtn.classList.add("disabled");
      continueBtn.disabled = true;

    }

  }

  continueBtn.disabled = true;

  /* ===================== */
  /* CONTINUAR             */
  /* ===================== */

  continueBtn.addEventListener("click", async () => {

    if (!sexo) return;

    /* ===================== */
    /* CALCULAR ORIENTACION  */
    /* ===================== */

    let orientacion = null;

    // ambos seleccionados
    if (wantsH && wantsM) {
      orientacion = "X";
    }

    // solo hombres
    else if (wantsH) {
      orientacion = "H";
    }

    // solo mujeres
    else if (wantsM) {
      orientacion = "M";
    }

    if (!orientacion) return;

    try {

      const userId = crypto.randomUUID();

      localStorage.setItem("user_id", userId);
      localStorage.setItem("sexo", sexo);
      localStorage.setItem("orientacion", orientacion);

      const { error } = await supabase
        .from("posts")
        .upsert(
          {
            user_id: userId,
            Sexo: sexo,
            Orientacion: orientacion
          },
          {
            onConflict: "user_id"
          }
        );

      if (error) {

        alert("Error guardando datos");
        return;

      }

      navigate("feed");

    } catch (err) {

      alert("Error inesperado");

    }

  });

}