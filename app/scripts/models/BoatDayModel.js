define([
'parse'
], function(Parse){
	var BoatDayModel = Parse.Object.extend("BoatDay", {

		defaults: {

			status: 'creation', 
			name: null,
			host: null, 
			boat: null, 
			captain: null, 
			date: null,
			departureTime: null,
			duration: null, 
			price: null, 
			availableSeats: null,
			bookedSeats: 0, 
			location: null, 
			description: null,
			bookingPolicy: null, 
			cancellationPolicy: null, 
			category: null,
			earnings: 0,
			features: {
				leisure: {
					cruising: false,
					partying: false,
					sightseeing: false,
					other: false
				},
				fishing: {
					flats: false,
					lake: false,
					offshore: false,
					recreational: false,
					other: false,
					equipment: false,
					equipmentItems: {
						bait: false,
						lines: false,
						hooks: false,
						lures: false,
						nets: false,
						rods: false,
						sinkers: false
					}
				},
				sports: {
					snorkeling: false,
					tubing: false,
					wakeBoarding: false,
					waterSkiing: false,
					equipment: false,
					equipmentItems: {
						fins: false,
						helmets: false,
						masks: false,
						snorkels: false,
						towLine: false,
						tubes: false,
						wakeboard: false,
						waterSkis: false
					}
				},
				global: {
					children: false,
					smoking: false,
					drinking: false,
					pets: false 
				}, 
				extras: {
					food: false,
					drink: false,
					music: false,
					towels: false,
					sunscreen: false,
					inflatables: false
				}
			}
		}

	});
	return BoatDayModel;
});