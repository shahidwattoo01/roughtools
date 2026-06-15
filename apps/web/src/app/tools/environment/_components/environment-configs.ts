export interface EnvToolConfig {
  slug: string
  icon: string
  name: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  description: string
  tags: string[]
  howToSteps: { name: string; text: string }[]
  keyFeatures: { icon: string; title: string; description: string }[]
  proTips: string[]
  faqs: { q: string; a: string }[]
  relatedTools: { slug: string; icon: string; name: string; description: string }[]
}

export const ENV_CONFIGS: Record<string, EnvToolConfig> = {
  'carbon-footprint-calculator': {
    slug: 'carbon-footprint-calculator',
    icon: '🌍',
    name: 'Carbon Footprint Calculator',
    metaTitle: 'Carbon Footprint Calculator - Free Personal CO2 Calculator | RoughTools',
    metaDescription: 'Calculate your full annual carbon footprint from home energy, car travel, flights, diet, and shopping. Compare to UK and world average. Get a personalised reduction plan. Free.',
    keywords: ['carbon footprint calculator', 'CO2 calculator', 'personal carbon footprint', 'greenhouse gas calculator', 'carbon emissions calculator', 'climate calculator'],
    description: 'Calculate your total annual CO2e from home energy, travel, diet, and shopping. Compare to the UK and world average, and get a personalised reduction plan ranked by impact.',
    tags: ['Instant', 'Private', 'Free', '8 Categories'],
    howToSteps: [
      { name: 'Enter home energy data', text: 'Input your monthly electricity and gas bills or annual consumption figures. Approximate values work fine.' },
      { name: 'Add transport details', text: 'Enter your annual car mileage and fuel type, plus the number of flights you take each year and typical distances.' },
      { name: 'Describe your diet and shopping', text: 'Select how often you eat meat and your approximate level of consumer goods purchases.' },
      { name: 'View results and reduction plan', text: 'See your total CO2e broken down by category, compare it to the UK average, and review a ranked list of the changes with the biggest impact.' },
    ],
    keyFeatures: [
      { icon: '📊', title: '8-Category Breakdown', description: 'Covers home energy, car travel, flights, diet, and shopping for a complete picture of your personal emissions.' },
      { icon: '🌐', title: 'Global Benchmarks', description: 'Instantly compare your footprint to the UK average (10t CO2e/year) and the global average (7t CO2e/year).' },
      { icon: '📋', title: 'Reduction Plan', description: 'Get a personalised action plan ranked by impact so you focus on the changes that move the needle most.' },
    ],
    proTips: [
      'Use your actual energy bills for the most accurate result. Monthly averages from the past 12 months work better than seasonal estimates.',
      'The diet category often surprises people - switching from daily meat to a few times a week can save over 0.5 tonnes CO2e per year.',
      'Run the calculator twice - once for your current lifestyle and once with planned changes - to quantify the impact before committing.',
    ],
    faqs: [
      { q: 'How accurate is this carbon footprint calculator?', a: 'The calculator uses emission factors based on published data from the UK Department for Energy Security and Net Zero (DESNZ), IPCC reports, and peer-reviewed lifecycle assessment studies. Results are estimates - individual circumstances vary, but the tool provides a reliable order-of-magnitude assessment suitable for identifying your highest-impact areas.' },
      { q: 'Is my data safe? Does this tool store or share what I enter?', a: 'Your data never leaves your device. All calculations are performed entirely in your browser using JavaScript. Nothing you enter is transmitted to any server, stored in a database, or shared with third parties.' },
      { q: 'What is CO2e and why is it used?', a: 'CO2e stands for carbon dioxide equivalent. It converts all greenhouse gases - including methane and nitrous oxide - into a single comparable unit based on their global warming potential over 100 years. This allows different activities like flying, eating beef, and burning gas to be compared on the same scale.' },
      { q: 'What lifestyle changes reduce carbon footprint the most?', a: 'Research consistently shows the highest-impact individual actions are: switching to a plant-based diet (saves 0.5-1.5t CO2e/year), avoiding one long-haul flight (saves 1.5-3t), switching home heating from gas to a heat pump (saves 1-2t), and going car-free or switching to an EV (saves 1-2t).' },
      { q: 'Can I use the Carbon Footprint Calculator offline?', a: 'Once the page has fully loaded, the calculator works offline because all calculation logic runs in the browser with no server calls. You do not need an active internet connection after the initial page load.' },
      { q: 'Do I need to create an account to use this tool?', a: 'No account or registration is required. Open the calculator, enter your lifestyle information, and get your results immediately. There is no email address, password, or profile needed at any point.' },
    ],
    relatedTools: [
      { slug: 'ev-carbon-offset', icon: '⚡', name: 'EV Carbon Offset Calculator', description: 'Compare EV vs petrol emissions' },
      { slug: 'flight-carbon-calculator', icon: '✈️', name: 'Flight Carbon Calculator', description: 'Calculate flight CO2 emissions' },
      { slug: 'home-energy-audit', icon: '🏠', name: 'Home Energy Audit', description: 'Audit home energy efficiency' },
      { slug: 'solar-savings-calculator', icon: '☀️', name: 'Solar Savings Calculator', description: 'Calculate solar panel ROI' },
      { slug: 'waste-reduction-planner', icon: '♻️', name: 'Waste Reduction Planner', description: 'Build a zero-waste action plan' },
    ],
  },

  'ev-carbon-offset': {
    slug: 'ev-carbon-offset',
    icon: '⚡',
    name: 'EV Carbon Offset Calculator',
    metaTitle: 'EV Carbon Offset Calculator - Free EV vs Petrol Comparison | RoughTools',
    metaDescription: 'Compare your EV vs petrol or diesel car CO2 emissions. Calculate annual carbon savings, trees equivalent, fuel cost savings, and break-even point. Free, no signup.',
    keywords: ['EV carbon offset calculator', 'electric vehicle vs petrol emissions', 'EV carbon savings', 'electric car CO2 comparison', 'EV break-even calculator'],
    description: 'See exactly how much CO2 you save by switching to electric. Accounts for your local grid emissions, annual mileage, running cost savings, and financial break-even point.',
    tags: ['Instant', 'Private', 'Free', 'Grid-Accurate'],
    howToSteps: [
      { name: 'Enter your annual mileage', text: 'Input how many miles or kilometres you drive each year. Your car odometer or insurance renewal document is a good source.' },
      { name: 'Select your current vehicle', text: 'Choose your petrol or diesel vehicle type and enter its fuel efficiency (MPG or L/100km) to set the comparison baseline.' },
      { name: 'Select the EV and your country', text: 'Choose the electric vehicle you are comparing and select your country to apply the correct electricity grid carbon intensity.' },
      { name: 'Review your savings', text: 'See annual CO2 savings, equivalent trees offset, annual fuel cost savings, and the financial break-even point in years.' },
    ],
    keyFeatures: [
      { icon: '🌐', title: 'Grid-Accurate Emissions', description: 'Uses country-specific electricity grid carbon intensity so your EV comparison reflects the actual CO2 from your local power supply.' },
      { icon: '💰', title: 'Financial Break-Even', description: 'Calculates how many years until lower EV running costs offset the higher purchase price, giving you the full financial picture.' },
      { icon: '🌳', title: 'Trees Equivalent', description: 'Converts your annual CO2 saving into a tangible trees-planted equivalent to make the environmental benefit concrete.' },
    ],
    proTips: [
      'If you charge primarily from home solar or a 100% renewable tariff, your EV emissions are effectively zero - the grid intensity figure does not apply.',
      'The break-even calculation assumes average mileage. If you drive significantly more than average, the financial break-even comes much sooner.',
      'Remember that EV servicing costs are typically 30-40% lower than petrol cars due to fewer moving parts, which is not always factored into simple fuel comparisons.',
    ],
    faqs: [
      { q: 'Do EVs really produce less CO2 than petrol cars over their lifetime?', a: 'Yes, in almost all regions globally, an EV produces significantly less CO2 over its full lifetime than a comparable petrol car - even accounting for the higher emissions in manufacturing the battery. Studies from the ICCT and Transport & Environment show EVs in Europe produce 60-70% less lifetime CO2 than petrol cars today.' },
      { q: 'What is grid carbon intensity and why does it affect EV emissions?', a: 'Grid carbon intensity is the amount of CO2 produced per kilowatt-hour of electricity generated (gCO2/kWh). It varies significantly by country. Norway (nearly 100% hydro) is near zero, while coal-heavy grids can exceed 700 gCO2/kWh. The higher the grid intensity, the more CO2 an EV produces indirectly through charging.' },
      { q: 'How accurate are the EV vs petrol emission calculations?', a: 'Emission calculations use published grid carbon intensity figures for major countries and standard vehicle lifecycle emission factors from peer-reviewed sources including the International Council on Clean Transportation (ICCT). Results are estimates - your actual savings depend on your specific vehicles, real-world driving, and local electricity mix.' },
      { q: 'How is the financial break-even point calculated?', a: 'The break-even point is when total EV ownership cost equals the equivalent petrol car cost, accounting for the higher EV purchase price and the lower ongoing fuel and maintenance costs. EVs typically cost 3-4x less per mile to fuel, and servicing costs are lower due to fewer moving parts. Break-even is typically 3-8 years depending on mileage.' },
      { q: 'Is my data safe? Does this tool store what I enter?', a: 'Your data never leaves your device. All calculations are performed entirely in your browser. Nothing you enter is transmitted to any server, stored in a database, or shared with third parties.' },
    ],
    relatedTools: [
      { slug: 'carbon-footprint-calculator', icon: '🌍', name: 'Carbon Footprint Calculator', description: 'Calculate your total CO2 footprint' },
      { slug: 'flight-carbon-calculator', icon: '✈️', name: 'Flight Carbon Calculator', description: 'Calculate flight CO2 emissions' },
      { slug: 'home-energy-audit', icon: '🏠', name: 'Home Energy Audit', description: 'Audit home energy efficiency' },
      { slug: 'solar-savings-calculator', icon: '☀️', name: 'Solar Savings Calculator', description: 'Calculate solar panel ROI' },
      { slug: 'waste-reduction-planner', icon: '♻️', name: 'Waste Reduction Planner', description: 'Build a zero-waste action plan' },
    ],
  },

  'flight-carbon-calculator': {
    slug: 'flight-carbon-calculator',
    icon: '✈️',
    name: 'Flight Carbon Calculator',
    metaTitle: 'Flight Carbon Calculator - Free Flight Emissions Tool | RoughTools',
    metaDescription: 'Calculate the carbon footprint of any flight. Get CO2 per passenger by cabin class, equivalent car miles, and offset cost. Includes radiative forcing. Free, no signup.',
    keywords: ['flight carbon calculator', 'aviation carbon footprint', 'flight CO2 emissions', 'airline emissions calculator', 'flight carbon offset'],
    description: 'Calculate the CO2 footprint of any flight by route, cabin class, and number of passengers. Includes radiative forcing multiplier and carbon offset cost estimate.',
    tags: ['Instant', 'Private', 'Free', 'Radiative Forcing'],
    howToSteps: [
      { name: 'Enter origin and destination', text: 'Type the departure and arrival airports or cities. The calculator uses the great-circle distance between them.' },
      { name: 'Select cabin class and passengers', text: 'Choose economy, business, or first class and enter the number of passengers. Business and first class emit significantly more CO2 per seat due to the larger floor area allocated.' },
      { name: 'Choose radiative forcing option', text: 'Toggle radiative forcing (RF) to account for the warming effect of contrails and high-altitude emissions, which roughly doubles the climate impact of aviation.' },
      { name: 'View emissions and offset cost', text: 'See total CO2e, emissions per passenger, equivalent car miles, and the estimated cost to offset via verified carbon credits.' },
    ],
    keyFeatures: [
      { icon: '🛫', title: 'Cabin Class Accuracy', description: 'Correctly accounts for the larger seat footprint in business and first class, which produces 2-4x more emissions per passenger than economy.' },
      { icon: '🌡️', title: 'Radiative Forcing', description: 'Includes an optional RF multiplier to capture the full climate impact of high-altitude aviation emissions beyond CO2 alone.' },
      { icon: '💚', title: 'Offset Cost Estimate', description: 'Calculates a realistic carbon offset cost based on current verified carbon credit market prices to help you neutralise your flight emissions.' },
    ],
    proTips: [
      'Enable the radiative forcing multiplier for a more complete picture - aviation\'s total climate impact is roughly 2x the CO2 figure alone due to contrails and other effects.',
      'A single long-haul return flight can equal several months of driving. Combining trips to reduce flight frequency is more effective than offsetting.',
      'Business class emits roughly 3x more CO2 per passenger than economy on the same flight due to the larger seat footprint allocated per person.',
    ],
    faqs: [
      { q: 'Why does cabin class affect CO2 emissions?', a: 'Business and first class seats take up significantly more floor area per passenger than economy seats. Since total aircraft emissions are allocated per unit of floor space, a business class passenger is responsible for 2-3x more emissions than an economy passenger on the same flight.' },
      { q: 'What is radiative forcing and should I include it?', a: 'Radiative forcing (RF) captures the additional warming effects of aviation beyond CO2 alone - including the formation of contrail cirrus clouds and the effects of NOx emissions at high altitude. These effects roughly double the climate impact of aviation. Including RF gives a more complete picture of a flight\'s climate impact.' },
      { q: 'How accurate is this flight carbon calculator?', a: 'The calculator uses ICAO and DEFRA emission factors combined with great-circle route distances. Results are estimates - actual emissions vary by aircraft type, load factor, weather, and routing. The tool provides a reliable comparative estimate suitable for personal carbon accounting and offset decisions.' },
      { q: 'Is my data safe? Does this tool store what I enter?', a: 'Your data never leaves your device. All calculations are performed entirely in your browser. Nothing you enter is transmitted to any server, stored, or shared with third parties.' },
      { q: 'How do carbon offsets work for flights?', a: 'Carbon offsets fund projects that reduce or remove CO2 elsewhere - such as reforestation, renewable energy, or methane capture. Verified credits from schemes like Gold Standard or Verra are the most reliable. Offsetting is a useful tool but reducing flight frequency has a greater direct impact.' },
    ],
    relatedTools: [
      { slug: 'carbon-footprint-calculator', icon: '🌍', name: 'Carbon Footprint Calculator', description: 'Calculate your total CO2 footprint' },
      { slug: 'ev-carbon-offset', icon: '⚡', name: 'EV Carbon Offset Calculator', description: 'Compare EV vs petrol emissions' },
      { slug: 'home-energy-audit', icon: '🏠', name: 'Home Energy Audit', description: 'Audit home energy efficiency' },
      { slug: 'solar-savings-calculator', icon: '☀️', name: 'Solar Savings Calculator', description: 'Calculate solar panel ROI' },
      { slug: 'waste-reduction-planner', icon: '♻️', name: 'Waste Reduction Planner', description: 'Build a zero-waste action plan' },
    ],
  },

  'home-energy-audit': {
    slug: 'home-energy-audit',
    icon: '🏠',
    name: 'Home Energy Audit',
    metaTitle: 'Home Energy Audit - Free Energy Efficiency Calculator | RoughTools',
    metaDescription: 'Audit your home energy use room by room. Get an energy efficiency grade, consumption breakdown, and personalised actions to cut bills by up to 35%. Free, no signup.',
    keywords: ['home energy audit', 'home energy efficiency calculator', 'energy audit tool', 'home energy consumption', 'reduce energy bills', 'home insulation calculator'],
    description: 'Audit your home energy use room by room. Get an efficiency grade, consumption breakdown, annual cost estimate, and a ranked list of improvements to cut your bills.',
    tags: ['Instant', 'Private', 'Free', 'Room-by-Room'],
    howToSteps: [
      { name: 'Enter home details', text: 'Provide your home type, floor area, age, and number of occupants. These factors heavily influence baseline energy consumption.' },
      { name: 'Answer heating and insulation questions', text: 'Describe your heating system, thermostat settings, insulation levels, and window type. Heating accounts for around 60% of most home energy bills.' },
      { name: 'Add appliance and lighting data', text: 'Indicate the age and efficiency of major appliances, your lighting type, and hot water system to complete the consumption picture.' },
      { name: 'Review grade and action plan', text: 'See your energy efficiency grade (A-G), estimated annual energy cost, and a prioritised list of improvements ranked by bill-saving impact.' },
    ],
    keyFeatures: [
      { icon: '🏆', title: 'Efficiency Grade A-G', description: 'Receive an EPC-style energy efficiency grade that lets you benchmark your home against UK housing stock standards.' },
      { icon: '💡', title: 'Ranked Improvements', description: 'Get a prioritised action plan showing which upgrades - insulation, heating, lighting - will save the most money per pound spent.' },
      { icon: '💰', title: 'Bill Savings Estimate', description: 'See a realistic estimate of how much you could save annually by implementing the recommended improvements.' },
    ],
    proTips: [
      'Loft insulation and cavity wall insulation typically offer the best return on investment - payback periods of 2-4 years are common at current energy prices.',
      'Switching from a gas boiler to a heat pump saves both money and carbon emissions, but the upfront cost is significant. Check government grants available in your area.',
      'Simply lowering your thermostat by 1°C typically reduces heating bills by around 10% with no capital cost.',
    ],
    faqs: [
      { q: 'How accurate is this home energy audit tool?', a: 'The audit uses energy consumption benchmarks from the UK Energy Research Centre and DEFRA household energy statistics. Results are estimates based on typical homes of your type - actual consumption varies by occupant behaviour, microclimate, and maintenance. The tool provides a reliable guide for identifying improvement priorities rather than a certified EPC assessment.' },
      { q: 'What is an EPC and how does this compare?', a: 'An Energy Performance Certificate (EPC) is an official assessment of a property\'s energy efficiency conducted by a certified assessor. This tool provides a self-assessment estimate using the same A-G rating scale. For selling, renting, or accessing certain grants, you will need an official EPC from a certified assessor rather than this self-assessment tool.' },
      { q: 'Which home improvements save the most energy?', a: 'In most UK homes, the highest-impact improvements are: loft insulation (saves 15-25% of heating bills), cavity or solid wall insulation (saves 20-35%), upgrading to a condensing boiler or heat pump (saves 15-30%), double or triple glazing (saves 10-15%), and smart thermostatic controls (saves 10-15%).' },
      { q: 'Is my data safe? Does this tool store what I enter?', a: 'Your data never leaves your device. All calculations are performed entirely in your browser. Nothing you enter about your home is transmitted to any server, stored in a database, or shared with third parties.' },
      { q: 'Do I need to create an account to use this tool?', a: 'No account or registration is required. Open the Home Energy Audit, answer the questions, and receive your results immediately. There is no email address, password, or profile needed at any point.' },
    ],
    relatedTools: [
      { slug: 'carbon-footprint-calculator', icon: '🌍', name: 'Carbon Footprint Calculator', description: 'Calculate your total CO2 footprint' },
      { slug: 'ev-carbon-offset', icon: '⚡', name: 'EV Carbon Offset Calculator', description: 'Compare EV vs petrol emissions' },
      { slug: 'flight-carbon-calculator', icon: '✈️', name: 'Flight Carbon Calculator', description: 'Calculate flight CO2 emissions' },
      { slug: 'solar-savings-calculator', icon: '☀️', name: 'Solar Savings Calculator', description: 'Calculate solar panel ROI' },
      { slug: 'waste-reduction-planner', icon: '♻️', name: 'Waste Reduction Planner', description: 'Build a zero-waste action plan' },
    ],
  },

  'solar-savings-calculator': {
    slug: 'solar-savings-calculator',
    icon: '☀️',
    name: 'Solar Savings Calculator',
    metaTitle: 'Solar Savings Calculator - Free Solar Panel ROI Tool | RoughTools',
    metaDescription: 'Calculate how much you save with solar panels. Get payback period, annual savings, 25-year ROI, and CO2 offset based on your home size and location. Free, no signup.',
    keywords: ['solar savings calculator', 'solar panel ROI calculator', 'solar payback period', 'solar energy savings', 'home solar calculator', 'solar panel cost calculator'],
    description: 'Calculate your solar panel payback period, annual savings, 25-year return on investment, and CO2 offset. Based on your roof size, location, and local electricity tariff.',
    tags: ['Instant', 'Private', 'Free', '25-Year ROI'],
    howToSteps: [
      { name: 'Enter your roof details', text: 'Input your available south-facing roof area and roof pitch. These determine how many panels you can install and how much sunlight they receive.' },
      { name: 'Select your location', text: 'Choose your country or region to apply the correct solar irradiance figure for your latitude and typical cloud cover.' },
      { name: 'Enter your electricity tariff', text: 'Input your current electricity unit rate (p/kWh). The higher your tariff, the faster the payback period.' },
      { name: 'Review ROI and savings', text: 'See annual energy generation, annual bill savings, simple payback period, 25-year ROI, and lifetime CO2 avoided.' },
    ],
    keyFeatures: [
      { icon: '📈', title: '25-Year ROI Projection', description: 'See the full financial return over a typical solar system lifetime, including cumulative savings at year 5, 10, and 25.' },
      { icon: '🌍', title: 'Location-Based Generation', description: 'Uses real solar irradiance data for your region so projections reflect actual sunlight availability rather than generic estimates.' },
      { icon: '💡', title: 'Break-Even Analysis', description: 'Calculates the exact year your system pays for itself based on your local tariff, roof size, and installation cost.' },
    ],
    proTips: [
      'A south-facing roof pitched at 30-40 degrees gives the highest annual generation in the UK. East-west facing roofs generate less but spread production across more hours of the day.',
      'Battery storage significantly improves ROI if you\'re not home during peak generation hours. Self-consumption rates rise from around 30% to 70%+ with a well-sized battery.',
      'Check eligibility for the Smart Export Guarantee (SEG) - UK energy suppliers must offer a tariff for excess electricity you export to the grid, improving overall returns.',
    ],
    faqs: [
      { q: 'How accurate is this solar savings calculator?', a: 'The calculator uses solar irradiance data from the Global Solar Atlas and standard panel efficiency assumptions. Results are estimates - actual generation depends on shading, panel orientation, weather variation, and inverter efficiency. The tool provides a reliable planning estimate; get 3 installer quotes for precise figures before purchasing.' },
      { q: 'What is a typical payback period for solar panels in the UK?', a: 'At current electricity prices (around 24-30p/kWh), a typical 4kWp system in the UK has a simple payback period of 8-12 years. This has improved significantly with rising energy prices - payback periods were 15-20 years a decade ago. A 25-year system lifetime typically delivers 2-3x return on investment.' },
      { q: 'Does battery storage improve solar ROI?', a: 'Battery storage improves ROI by increasing self-consumption from around 30% to 70%+, allowing you to use solar energy generated during the day after dark. However, batteries add significant upfront cost. ROI depends heavily on your energy usage pattern - households with high evening electricity use benefit most.' },
      { q: 'Is my data safe? Does this tool store what I enter?', a: 'Your data never leaves your device. All calculations are performed entirely in your browser. Nothing you enter about your home or energy use is transmitted to any server, stored, or shared.' },
      { q: 'Do I need an account to use this tool?', a: 'No account or registration is required. Open the Solar Savings Calculator, enter your details, and see your results immediately with no sign-up needed.' },
    ],
    relatedTools: [
      { slug: 'carbon-footprint-calculator', icon: '🌍', name: 'Carbon Footprint Calculator', description: 'Calculate your total CO2 footprint' },
      { slug: 'ev-carbon-offset', icon: '⚡', name: 'EV Carbon Offset Calculator', description: 'Compare EV vs petrol emissions' },
      { slug: 'flight-carbon-calculator', icon: '✈️', name: 'Flight Carbon Calculator', description: 'Calculate flight CO2 emissions' },
      { slug: 'home-energy-audit', icon: '🏠', name: 'Home Energy Audit', description: 'Audit home energy efficiency' },
      { slug: 'waste-reduction-planner', icon: '♻️', name: 'Waste Reduction Planner', description: 'Build a zero-waste action plan' },
    ],
  },

  'waste-reduction-planner': {
    slug: 'waste-reduction-planner',
    icon: '♻️',
    name: 'Waste Reduction Planner',
    metaTitle: 'Waste Reduction Planner - Free Zero Waste Calculator | RoughTools',
    metaDescription: 'Build a personalised zero-waste action plan. Estimate your household waste, recycling rate, landfill diversion, and CO2 from waste with practical tips. Free, no signup.',
    keywords: ['waste reduction planner', 'zero waste calculator', 'household waste calculator', 'recycling rate calculator', 'landfill diversion', 'waste reduction tips'],
    description: 'Build a personalised zero-waste action plan. Estimate your household waste output, recycling rate, landfill diversion potential, and CO2 from waste with practical tips.',
    tags: ['Instant', 'Private', 'Free', 'Action Plan'],
    howToSteps: [
      { name: 'Enter household details', text: 'Input the number of people in your household. Waste output scales roughly linearly with occupancy.' },
      { name: 'Describe your current waste habits', text: 'Answer questions about your recycling, composting, food waste, and general purchasing habits to establish your baseline.' },
      { name: 'Set your reduction goals', text: 'Choose which areas you want to improve - food waste, packaging, recycling rate - to get a targeted action plan.' },
      { name: 'Review your plan and metrics', text: 'See your estimated annual waste output, current recycling rate, potential landfill diversion, CO2 from waste, and a ranked list of practical actions.' },
    ],
    keyFeatures: [
      { icon: '📋', title: 'Personalised Action Plan', description: 'Receive a tailored set of waste reduction actions ranked by impact, specific to your household habits and goals.' },
      { icon: '📊', title: 'Waste Metrics', description: 'See your estimated annual waste in kg, recycling rate percentage, landfill diversion potential, and CO2 equivalent from waste.' },
      { icon: '🎯', title: 'Goal Tracking', description: 'Set a target recycling rate or waste reduction percentage and see exactly which actions will get you there.' },
    ],
    proTips: [
      'Food waste is the highest-impact category for most households - it accounts for 70kg of avoidable waste per person per year in the UK. Meal planning and portion control are the most effective fixes.',
      'Switching to a food waste caddy and compost bin diverts organic material from landfill, where it produces methane - a greenhouse gas 28x more potent than CO2.',
      'Buying loose produce instead of pre-packaged reduces plastic waste significantly. Many supermarkets now have dedicated loose produce sections.',
    ],
    faqs: [
      { q: 'How accurate are the waste estimates?', a: 'Waste output estimates are benchmarked against DEFRA household waste statistics and WRAP data. The average UK household produces approximately 400-500 kg of waste per year. Results are indicative estimates calibrated to your household size and reported habits, suitable for understanding your waste profile and identifying priorities rather than precise measurements.' },
      { q: 'What is landfill diversion and why does it matter?', a: 'Landfill diversion is the proportion of your waste that is kept out of landfill through recycling, composting, or energy recovery. Food and organic waste in landfill produces methane as it decomposes - a greenhouse gas 28x more potent than CO2 over 100 years. Diverting organic waste to composting eliminates this methane production.' },
      { q: 'What are the easiest ways to reduce household waste?', a: 'The highest-impact low-effort changes are: using a weekly meal plan to reduce food waste, switching to reusable shopping bags and produce bags, buying loose rather than pre-packaged goods, composting food scraps, and choosing products with minimal packaging. These combined can reduce household waste by 20-30%.' },
      { q: 'Is my data safe? Does this tool store what I enter?', a: 'Your data never leaves your device. All calculations are performed entirely in your browser. Nothing you enter about your household habits is transmitted to any server, stored in a database, or shared with anyone.' },
      { q: 'Do I need to create an account to use this tool?', a: 'No account or registration is required. Open the Waste Reduction Planner, complete the questions, and receive your personalised plan immediately. There is no email address, password, or profile needed at any point.' },
    ],
    relatedTools: [
      { slug: 'carbon-footprint-calculator', icon: '🌍', name: 'Carbon Footprint Calculator', description: 'Calculate your total CO2 footprint' },
      { slug: 'ev-carbon-offset', icon: '⚡', name: 'EV Carbon Offset Calculator', description: 'Compare EV vs petrol emissions' },
      { slug: 'flight-carbon-calculator', icon: '✈️', name: 'Flight Carbon Calculator', description: 'Calculate flight CO2 emissions' },
      { slug: 'home-energy-audit', icon: '🏠', name: 'Home Energy Audit', description: 'Audit home energy efficiency' },
      { slug: 'solar-savings-calculator', icon: '☀️', name: 'Solar Savings Calculator', description: 'Calculate solar panel ROI' },
    ],
  },
}
