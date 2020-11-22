export default function NumberToDay(num: Number, long?: boolean): string {
	switch (num) {
		case 0:
			return long ? 'dimanche' : 'dim';
		case 1:
			return long ? 'lundi' : 'lun';
		case 2:
			return long ? 'mardi' : 'mar';
		case 3:
			return long ? 'mercredi' : 'mer';
		case 4:
			return long ? 'jeudi' : 'jeu';
		case 5:
			return long ? 'vendredi' : 'ven';
		case 6:
			return long ? 'samedi' : 'sam';
		default:
			return '?';
	}
}
