import axios from 'axios'
import React, { useState } from 'react'

export default function FormPage() {
	const [step, setStep] = useState(0)

	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		q1_stars: 0,
		q2_option: '',
		q3_option: '',
		q4_option: '',
	})

	const nextStep = () => setStep((s) => Math.min(s + 1, 7))

	// 🔹 AJUSTE: cuando el name es q1_stars, guardamos número
	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: name === 'q1_stars' ? Number(value) : value,
		}))
	}

	const handleStarClick = (value) => {
		setFormData((prev) => ({ ...prev, q1_stars: value }))
	}

	const handleSubmit = async (e) => {
		try {
			e.preventDefault()
			console.log('FORM DATA =>', formData)
			const body = {
				name: formData.fullName,
				email: formData.email,
				satisfactory_logistic: formData.q1_stars,
				better_value_experience: formData.q2_option,
				better_value_experience_question_4: 'A',
				impressions: 'A',
			}
			const res = await axios.post(
				'https://medplus-survey-results-api.eml.com.co/api/survey-results',
				body
			)
			if (res.data.data) {
				setStep(7)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const canContinue = () => {
		switch (step) {
			case 1:
				return formData.fullName.trim().length > 2
			case 2:
				return formData.email.trim().length > 5
			case 3:
				return formData.q1_stars > 0 // ✅ ahora sí se llena en el step 3
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

			{/* HEADER NEGRO + FRANJA AMARILLA — SOLO MOSTRAR EN STEPS 0–6 */}
			{step !== 7 && (
				<header className="w-full bg-black">
					<div className="max-w-6xl mx-auto h-24 px-6 flex items-center justify-between">
						<img
							src="/images/logoem.png"
							alt="TNC Encuesta"
							className="h-14 w-auto object-contain cursor-pointer"
							onClick={() => (window.location.href = '/')}
						/>
					</div>

					<div className="w-full h-[10px] bg-[#ffd438]" />
				</header>
			)}

			<div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
				<div key={step} className="question-container">
					{/* STEP 0 – INTRO */}
					{step === 0 && (
						<div className="intro-block text-left">
							<p className="intro-text">
								“ Tu opinión es importante para nosotros. Por
								eso, te pedimos{' '}
								<span className="font-semibold">5 minutos</span>{' '}
								de tu tiempo para darnos{' '}
								<span className="font-semibold">Feedback</span>{' '}
								y mejorar en futuras oportunidades…
							</p>

							<button
								type="button"
								onClick={nextStep}
								className="
									mt-8 inline-flex items-center justify-center
									rounded-md px-8 py-2 text-sm font-semibold text-black
									shadow-lg shadow-black/40
									transition-all duration-300 ease-out
									hover:scale-105 hover:shadow-[0_6px_20px_rgba(247,208,138,0.6)]
									active:scale-95
								"
								style={{
									background:
										'linear-gradient(90deg, #b8860b 0%, #f7d08a 50%, #b8860b 100%)',
								}}>
								Continuar
							</button>
						</div>
					)}

					{/* STEPS 1–6 */}
					{step > 0 && step <= 6 && (
						<form onSubmit={handleSubmit} className="space-y-8">
							{/* STEP 1 */}
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
											}`}
											style={
												!canContinue()
													? {}
													: {
															background:
																'linear-gradient(90deg, #b8860b 0%, #f7d08a 50%, #b8860b 100%)',
															color: '#000',
													  }
											}>
											Aceptar
										</button>
									</div>
								</>
							)}

							{/* STEP 2 */}
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
											}`}
											style={
												!canContinue()
													? {}
													: {
															background:
																'linear-gradient(90deg, #b8860b 0%, #f7d08a 50%, #b8860b 100%)',
															color: '#000',
													  }
											}>
											Aceptar
										</button>
									</div>
								</>
							)}

							{/* STEP 3 – OPCIONES 2–2–1 */}
							{step === 3 && (
								<>
									<p className="question-label">
										<span
											className="question-number"
											style={{
												width: '30px',
												height: '30px',
											}}>
											1
										</span>
										En una escala del 1 al 5, ¿qué tan
										satisfecho(a) quedaste con el Evento
										Médico 2025 teniendo en cuenta
										organización, contenido, logística y
										experiencia general?
									</p>

									{/* GRID 2 - 2 - 1 */}
									<div
										className="options-grid"
										style={{
											display: 'grid',
											gridTemplateColumns:
												'repeat(2, 1fr)',
											gap: '14px',
											maxWidth: '520px',
											margin: 'clamp(16px, 3vh, 40px) auto 0',
										}}>
										{/* 1 */}
										<label
											className={`choice-row choice-row--compact ${
												formData.q1_stars === 1
													? 'choice-row--active'
													: ''
											}`}>
											<span className="choice-badge choice-badge--square">
												1
											</span>
											<input
												type="radio"
												name="q1_stars"
												value="1"
												onChange={handleChange}
												className="hidden"
											/>
											<span>Muy Insatisfecho</span>
										</label>

										{/* 2 */}
										<label
											className={`choice-row choice-row--compact ${
												formData.q1_stars === 2
													? 'choice-row--active'
													: ''
											}`}>
											<span className="choice-badge choice-badge--square">
												2
											</span>
											<input
												type="radio"
												name="q1_stars"
												value="2"
												onChange={handleChange}
												className="hidden"
											/>
											<span>Insatisfecho</span>
										</label>

										{/* 3 */}
										<label
											className={`choice-row choice-row--compact ${
												formData.q1_stars === 3
													? 'choice-row--active'
													: ''
											}`}>
											<span className="choice-badge choice-badge--square">
												3
											</span>
											<input
												type="radio"
												name="q1_stars"
												value="3"
												onChange={handleChange}
												className="hidden"
											/>
											<span>Neutral</span>
										</label>

										{/* 4 */}
										<label
											className={`choice-row choice-row--compact ${
												formData.q1_stars === 4
													? 'choice-row--active'
													: ''
											}`}>
											<span className="choice-badge choice-badge--square">
												4
											</span>
											<input
												type="radio"
												name="q1_stars"
												value="4"
												onChange={handleChange}
												className="hidden"
											/>
											<span>Satisfecho</span>
										</label>

										{/* FILA 5 → UNA SOLA OPCIÓN CENTRADA */}
										<div
											style={{
												gridColumn: '1 / span 2',
												display: 'flex',
												justifyContent: 'center',
											}}>
											<label
												className={`choice-row choice-row--compact ${
													formData.q1_stars === 5
														? 'choice-row--active'
														: ''
												}`}
												style={{ width: '60%' }}>
												<span className="choice-badge choice-badge--square">
													5
												</span>
												<input
													type="radio"
													name="q1_stars"
													value="5"
													onChange={handleChange}
													className="hidden"
												/>
												<span>Muy Satisfecho</span>
											</label>
										</div>
									</div>

									<button
										type="button"
										onClick={nextStep}
										disabled={!canContinue()}
										className={`primary-btn ${
											!canContinue() ? 'btn-disabled' : ''
										}`}
										style={
											!canContinue()
												? {}
												: {
														background:
															'linear-gradient(90deg, #b8860b 0%, #f7d08a 50%, #b8860b 100%)',
														color: '#000',
												  }
										}>
										Aceptar
									</button>
								</>
							)}

							{/* STEP 4 */}
							{step === 4 && (
								<>
									<p className="question-label">
										<span className="question-number">
											2
										</span>
										¿Qué elemento aportó más valor a tu
										experiencia?
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
													opt.key
														? 'choice-row--active'
														: ''
												}`}>
												<span className="choice-badge choice-badge--square">
													{opt.key}
												</span>
												<input
													type="radio"
													name="q2_option"
													value={opt.key}
													onChange={handleChange}
													className="hidden"
												/>
												<span>{opt.label}</span>
											</label>
										))}
									</div>

									<button
										type="submit"
										disabled={!canContinue()}
										className={`primary-btn ${
											!canContinue() ? 'btn-disabled' : ''
										}`}
										style={
											!canContinue()
												? {}
												: {
														background:
															'linear-gradient(90deg, #b8860b 0%, #f7d08a 50%, #b8860b 100%)',
														color: '#000',
												  }
										}>
										Enviar
									</button>
								</>
							)}
						</form>
					)}

					{/* ⭐ NUEVO: STEP 7 – PANTALLA “GRACIAS” */}
					{step === 7 && (
						<div className="flex flex-col items-center text-center gap-8">
							<img
								src="/images/logoem.png"
								alt="Nariño Challenge 2025"
								className="w-[320px] sm:w-[420px] md:w-[300px] max-w-full select-none"
							/>

							<div className="space-y-2">
								<p className="text-2xl sm:text-3xl font-semibold text-white">
									Muchas gracias!
								</p>
								<p className="text-sm sm:text-2xl text-slate-300">
									¡Gracias por compartirnos tu experiencia,
									ahora accede a las memorias del evento
									médico MedPlus 2025!
								</p>
							</div>

							<button
								type="button"
								onClick={() =>
									(window.location.href = '/gallery')
								}
								className="
        mt-2 rounded-md px-8 py-2
        text-sm font-semibold text-black
        shadow-lg shadow-black/40
        transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-[0_6px_20px_rgba(247,208,138,0.6)]
        active:scale-95
    "
								style={{
									background:
										'linear-gradient(90deg, #b8860b 0%, #f7d08a 50%, #b8860b 100%)',
								}}>
								VER GALERIA!
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
