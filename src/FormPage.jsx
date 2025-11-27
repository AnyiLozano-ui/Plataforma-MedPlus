import React, { useState } from 'react'

export default function FormPage() {
	const [step, setStep] = useState(0)

	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		q1_stars: 0, // Pregunta 1 – satisfacción general (1 a 5)
		q2_option: '', // Pregunta 2 – elemento que aportó más valor
		q3_option: '', // Pregunta 3 – mismo estilo, otra pregunta
		q4_option: '', // Pregunta 4 – mejor impresión
	})

	// ⭐ CAMBIO: ahora el máximo es 7 (la pantalla final)
	const nextStep = () => setStep((s) => Math.min(s + 1, 7))

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleStarClick = (value) => {
		setFormData((prev) => ({ ...prev, q1_stars: value }))
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		console.log('FORM DATA =>', formData)
		// ⭐ CAMBIO: quitamos alert y pasamos al paso 7 (pantalla de gracias)
		setStep(7)
	}

	const canContinue = () => {
		switch (step) {
			case 1:
				return formData.fullName.trim().length > 2
			case 2:
				return formData.email.trim().length > 5
			case 3:
				return formData.q1_stars > 0
			case 4:
				return !!formData.q2_option
			case 5:
				return !!formData.q3_option
			case 6:
				return !!formData.q4_option
			default:
				return true
		}
	}

	return (
		<div className="nc-bg">
			{/* fondo de puntos */}
			<div className="nc-plane nc-plane-bottom" />
			<div className="nc-plane nc-plane-top" />
			<div className="nc-middle" />

			<div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
				<div key={step} className="question-container">
					{/* STEP 0 – INTRO */}
					{step === 0 && (
						<div className="intro-block text-left">
							<p className="intro-text">
								“ Tu opinión es importante para nosotros. Por eso,
								te pedimos{' '}
								<span className="font-semibold">
									5 minutos
								</span>{' '}
								de tu tiempo para darnos{' '}
								<span className="font-semibold">Feedback</span>{' '}
								y mejorar en futuras oportunidades…
							</p>

							<button
								type="button"
								onClick={nextStep}
								className="
        mt-8
        inline-flex items-center justify-center
        rounded-md bg-[#ffd438] px-8 py-2 text-sm font-semibold text-black
        shadow-lg shadow-black/40
        transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-[0_6px_20px_rgba(255,212,56,0.6)]
        active:scale-95
      ">
								Continuar
							</button>
						</div>
					)}

					{/* STEPS 1–6 */}
					{/* ⭐ CAMBIO: el form solo se muestra hasta el step 6 */}
					{step > 0 && step <= 6 && (
						<form onSubmit={handleSubmit} className="space-y-8">
							{/* STEP 1 – NOMBRE (sin numerito de pregunta) */}
							{step === 1 && (
								<>
									<p className="question-label">
										¿Cuál es tu nombre completo?*
									</p>

									<div className="field-block">
										<input
											type="text"
											name="fullName"
											value={formData.fullName}
											onChange={handleChange}
											placeholder="Escribe tu nombre completo"
											className="question-input"
											autoFocus
										/>

										<button
											type="button"
											onClick={nextStep}
											disabled={!canContinue()}
											className={`primary-btn ${
												!canContinue()
													? 'btn-disabled'
													: ''
											}`}>
											Aceptar
										</button>
									</div>
								</>
							)}

							{/* STEP 2 – CORREO (sin numerito de pregunta) */}
							{step === 2 && (
								<>
									<p className="question-label">
										¿Cuál es tu correo electrónico?*
									</p>

									<div className="field-block">
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											placeholder="tucorreo@ejemplo.com"
											className="question-input"
											autoFocus
										/>

										<button
											type="button"
											onClick={nextStep}
											disabled={!canContinue()}
											className={`primary-btn ${
												!canContinue()
													? 'btn-disabled'
													: ''
											}`}>
											Aceptar
										</button>
									</div>
								</>
							)}

							{/* STEP 3 – PREGUNTA 1 (ESTRELLAS) */}
							{step === 3 && (
								<>
									<p className="question-label">
										<span className="question-number" style={{width: "30px", height: "30px" }}>
											1
										</span>
										En una escala del 1 al 5, ¿qué tan
										satisfecho(a) quedaste con el Evento
										Médico 2025 teniendo en cuenta aspectos
										como organización, contenido, logística
										y experiencia general?*
									</p>
									<p className="question-help">
										Siendo 1 muy malo y 5 muy bueno.
									</p>

									<div className="rating-row">
										{[1, 2, 3, 4, 5].map((star) => (
											<div
												key={star}
												className="rating-item">
												<button
													type="button"
													onClick={() =>
														handleStarClick(star)
													}
													className={`star-btn ${
														formData.q1_stars >=
														star
															? 'star-btn--active'
															: ''
													}`}>
													★
												</button>
												<span className="rating-label">
													{star}
												</span>
											</div>
										))}
									</div>

									<button
										type="button"
										onClick={nextStep}
										disabled={!canContinue()}
										className={`primary-btn ${
											!canContinue() ? 'btn-disabled' : ''
										}`}>
										Aceptar
									</button>
								</>
							)}

							{/* STEP 4 – PREGUNTA 2 */}
							{step === 4 && (
								<>
									<p className="question-label">
										<span className="question-number">
											2
										</span>
										¿Qué elemento aportó más valor a tu
										experiencia?*
									</p>

									<div className="choice-group choice-group--compact">
										{[
											{
												key: 'A',
												label: 'Atención personalizada',
											},
											{
												key: 'B',
												label: 'Cercanía con el equipo MedPlus',
											},
											{
												key: 'C',
												label: 'Calidad del espectáculo',
											},
											{
												key: 'D',
												label: 'Orden y puntualidad',
											},
											{
												key: 'E',
												label: 'Comodidad en el lugar',
											},
										].map((opt) => (
											<label
												key={opt.key}
												className={`choice-row choice-row--compact ${
													formData.q2_option ===
													opt.label
														? 'choice-row--active'
														: ''
												}`}>
												<span className="choice-badge choice-badge--square">
													{opt.key}
												</span>
												<input
													type="radio"
													name="q2_option"
													value={opt.label}
													onChange={handleChange}
													className="hidden"
												/>
												<span>{opt.label}</span>
											</label>
										))}
									</div>

									<button
										type="button"
										onClick={nextStep}
										disabled={!canContinue()}
										className={`primary-btn ${
											!canContinue() ? 'btn-disabled' : ''
										}`}>
										Aceptar
									</button>
								</>
							)}

							{/* STEP 5 – PREGUNTA 3 (misma estructura que la 2) */}
							{step === 5 && (
								<>
									<p className="question-label">
										<span className="question-number">
											3
										</span>
										¿Qué elemento aportó más valor a tu
										experiencia?*
									</p>

									<div className="choice-group choice-group--compact">
										{[
											{
												key: 'A',
												label: 'Atención personalizada',
											},
											{
												key: 'B',
												label: 'Cercanía con el equipo MedPlus',
											},
											{
												key: 'C',
												label: 'Calidad del espectáculo',
											},
											{
												key: 'D',
												label: 'Orden y puntualidad',
											},
											{
												key: 'E',
												label: 'Comodidad en el lugar',
											},
										].map((opt) => (
											<label
												key={opt.key}
												className={`choice-row choice-row--compact ${
													formData.q3_option ===
													opt.label
														? 'choice-row--active'
														: ''
												}`}>
												<span className="choice-badge choice-badge--square">
													{opt.key}
												</span>
												<input
													type="radio"
													name="q3_option"
													value={opt.label}
													onChange={handleChange}
													className="hidden"
												/>
												<span>{opt.label}</span>
											</label>
										))}
									</div>

									<button
										type="button"
										onClick={nextStep}
										disabled={!canContinue()}
										className={`primary-btn ${
											!canContinue() ? 'btn-disabled' : ''
										}`}>
										Aceptar
									</button>
								</>
							)}

							{/* STEP 6 – PREGUNTA 4 */}
							{step === 6 && (
								<>
									<p className="question-label">
										<span className="question-number">
											4
										</span>
										¿Qué te dejó la mejor impresión del
										evento?*
									</p>

									<div className="choice-group choice-group--compact">
										{[
											{
												key: 'A',
												label: 'El trato del personal',
											},
											{
												key: 'B',
												label: 'La producción del evento',
											},
											{
												key: 'C',
												label: 'La experiencia en conjunto',
											},
											{
												key: 'D',
												label: 'La exclusividad de la invitación',
											},
											{
												key: 'E',
												label: 'La calidad del entretenimiento',
											},
										].map((opt) => (
											<label
												key={opt.key}
												className={`choice-row choice-row--compact ${
													formData.q4_option ===
													opt.label
														? 'choice-row--active'
														: ''
												}`}>
												<span className="choice-badge choice-badge--square">
													{opt.key}
												</span>
												<input
													type="radio"
													name="q4_option"
													value={opt.label}
													onChange={handleChange}
													className="hidden"
												/>
												<span>{opt.label}</span>
											</label>
										))}
									</div>

									{/* Último paso: enviamos el formulario */}
									<button
										type="submit"
										disabled={!canContinue()}
										className={`primary-btn ${
											!canContinue() ? 'btn-disabled' : ''
										}`}>
										Enviar
									</button>
								</>
							)}
						</form>
					)}

					{/* ⭐ NUEVO: STEP 7 – PANTALLA DE MUCHAS GRACIAS */}
					{step === 7 && (
						<div className="flex flex-col items-center text-center gap-8">
							{/* Logo grande (usa el mismo que en la landing) */}
							<img
								src="/images/logoem.png"
								alt="Nariño Challenge 2025"
								className="w-[320px] sm:w-[420px] md:w-[520px] max-w-full select-none"
							/>

							<div className="space-y-2">
								<p className="text-2xl sm:text-3xl font-semibold text-white">
									Muchas gracias!
								</p>
								<p className="text-sm sm:text-base text-slate-300">
									Tu opinión es muy importante para nosotros.
								</p>
							</div>

							<button
								type="button"
								onClick={() =>
									window.location.href="/gallery"
								}
								className="
									mt-2 rounded-md bg-[#ffd438] px-8 py-2
									text-sm font-semibold text-black
									shadow-lg shadow-black/40
									transition-all duration-300 ease-out
									hover:scale-105 hover:shadow-[0_6px_20px_rgba(255,212,56,0.6)]
									active:scale-95
								">
								VER GALERIA!
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
