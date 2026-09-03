(() => {
  'use strict';

  const config = {
    schemaVersion: 1,
    updatedAt: '2026-09-03',
    productionDomainTarget: 'https://minadentalclinic.ir/',
    clinic: {
      name: 'دندانپزشکی دکتر مینا مازندرانی',
      publicArea: 'تهران، منطقه ۲۲'
    },
    verification: {
      exactAddress: false,
      mapPin: false,
      hours: false,
      phone: false,
      email: false,
      social: false,
      credentials: false,
      equipment: false,
      insurance: false,
      financing: false,
      pricing: false,
      reviews: false,
      beforeAfterConsent: false
    },
    contact: {
      phone: null,
      whatsapp: null,
      email: null
    },
    location: {
      address: null,
      latitude: null,
      longitude: null,
      googleMapsUrl: null,
      neshanUrl: null,
      baladUrl: null,
      wazeUrl: null
    },
    hours: null,
    social: {
      instagram: null,
      telegram: null
    },
    claims: {
      credentials: [],
      equipment: [],
      insurance: [],
      financing: null,
      warranties: []
    },
    pricing: null,
    reviews: [],
    media: {
      verifiedDoctorPhoto: null,
      verifiedClinicPhotos: [],
      beforeAfterCases: []
    }
  };

  const deepFreeze = (value) => {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
    return value;
  };

  Object.defineProperty(window, 'MINA_PUBLIC_CONFIG', {
    value: deepFreeze(config),
    configurable: false,
    enumerable: true,
    writable: false
  });
})();
