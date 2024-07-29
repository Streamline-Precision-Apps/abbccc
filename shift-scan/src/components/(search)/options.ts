export const CostCodeOptions = (data: any) => {

if (data == 'costcode') {
  const options = [
    { code: '#cc123gdj1', label: '1.0 Earthwork' },
    { code: '#cc123gdj2', label: '2.0 Foundation' },
    { code: '#cc123gdj3', label: '3.0 Concrete' },
    { code: '#cc123gdj4', label: '4.0 Masonry' },
    { code: 'cc123gdj5', label: '5.0 Structural Steel' },
    { code: 'cc123gdj6', label: '6.0 Carpentry' },
    { code: 'cc123gdj7', label: '7.0 Roofing' },
    { code: 'cc123gdj8', label: '8.0 Windows and Doors' },
    { code: 'cc123gdj9', label: '9.0 Drywall' },
    { code: 'cc123gdj10', label: '10.0 Flooring' },
    { code: 'cc123gdj11', label: '11.0 Painting' },
    { code: 'cc123gdj12', label: '12.0 Plumbing' },
    { code: 'cc123gdj13', label: '13.0 HVAC' },
    { code: 'cc123gdj14', label: '14.0 Electrical' },
    { code: 'cc123gdj15', label: '15.0 Landscaping' },
    { code: 'cc123gdj16', label: '16.0 Site Utilities' },
    { code: 'cc123gdj17', label: '17.0 Fire Protection' },
    { code: 'cc123gdj18', label: '18.0 Elevator' },
    { code: 'cc123gdj19', label: '19.0 Security' },
    { code: 'cc123gdj20', label: '20.0 Finishes' },
  ];
  return options;
}

if (data == 'jobsite') {
  const options = [
    { code: 'j123', label: 'Jobsite 1' },
    { code: 'j234', label: 'Jobsite 2' },
    { code: 'j345', label: 'Jobsite 3' },
    { code: 'j456', label: 'Jobsite 4' },
    { code: 'j567', label: 'Jobsite 5' },
    { code: 'j678', label: 'Jobsite 6' },
    { code: 'j789', label: 'Jobsite 7' },
    { code: 'j890', label: 'Jobsite 8' },
    { code: 'j901', label: 'Jobsite 9' },
    { code: 'j012', label: 'Jobsite 10' },
    { code: 'j111', label: 'Jobsite 11' },
    { code: 'j222', label: 'Jobsite 12' },
    { code: 'j333', label: 'Jobsite 13' },
    { code: 'j444', label: 'Jobsite 14' },
    { code: 'j555', label: 'Jobsite 15' },
    { code: 'j666', label: 'Jobsite 16' },
    { code: 'j777', label: 'Jobsite 17' },
    { code: 'j888', label: 'Jobsite 18' },
    { code: 'j999', label: 'banana' },
    { code: 'j000', label: 'orange' },
    { code: 'j111', label: 'apple' }
  ];
  return options;
}

if (data == 'equipment'){
  const options = [
      { code : 'EQ-123456', label: 'Equipment 1' },   
      { code : 'EQ-654321', label: 'Equipment 2' },
      { code : 'EQ-789012', label: 'Equipment 3' },   
  ];
  return options;
}

else {
  throw new Error('Invalid data');
}
}
