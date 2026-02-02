'use strict';

export function calcMaxCalories({ sex, ageYears, heightCm, weightKg, activity }) {
	const bmr =
		sex === "male"
			? 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5
			: 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
	
	const tdee = bmr * activity;
	const deficit = 600;
	return Math.round(tdee - deficit);
}