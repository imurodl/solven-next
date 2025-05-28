import React, { SyntheticEvent, useState } from 'react';
import { Box, Stack, Typography, Accordion, AccordionSummary, AccordionDetails, Chip } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const categories = [
	{ id: 'property', label: 'Property', icon: '🏠' },
	{ id: 'payment', label: 'Payment', icon: '💳' },
	{ id: 'buyers', label: 'Buyers', icon: '👥' },
	{ id: 'sellers', label: 'Sellers', icon: '🏡' },
	{ id: 'agents', label: 'Agents', icon: '👔' },
	{ id: 'legal', label: 'Legal', icon: '⚖️' },
	{ id: 'general', label: 'General', icon: 'ℹ️' },
	{ id: 'support', label: 'Support', icon: '🤝' },
];

const Faq = () => {
	const device = useDeviceDetect();
	const [category, setCategory] = useState<string>('property');
	const [expanded, setExpanded] = useState<string | false>('panel1');

	const changeCategoryHandler = (newCategory: string) => {
		setCategory(newCategory);
		setExpanded(false);
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	const data: any = {
		property: [
			{
				id: '00f5a45ed8897f8090116a01',
				subject: 'Are the properties displayed on the site reliable?',
				content: 'of course we only have verified properties',
			},
			{
				id: '00f5a45ed8897f8090116a22',
				subject: 'What types of properties do you offer?',
				content: 'We offer single-family homes, condos, townhouses, apartments, and penthouses',
			},
			{
				id: '00f5a45ed8897f8090116a21',
				subject: 'How can I search for properties on your website?',
				content: 'Simply use our search bar to enter location, price range, bedrooms/bathrooms, and property type.',
			},
			{
				id: '00f5a45ed8897f8090116a23',
				subject: 'Do you provide assistance for first-time homebuyers?',
				content: 'Yes, we guide you through the process and help find suitable financing.',
			},
			{
				id: '00f5a45ed8897f8090116a24',
				subject: 'What should I consider when buying a property?',
				content: 'Location, condition, size, amenities, and future development plans.',
			},
			{
				id: '00f5a45ed8897f8090116a25',
				subject: 'How long does the home-buying process typically take?',
				content: 'Usually 3 to 6 days, depending on various factors.',
			},
			{
				id: '00f5a45ed8897f8090116a29',
				subject: 'What happens if I encounter issues with the property after purchase?',
				content: 'We offer post-purchase support to address any concerns promptly.',
			},
			{
				id: '00f5a45ed8897f8090116a28',
				subject: 'Do you offer properties in specific neighborhoods?',
				content: 'Yes, we have listings in various neighborhoods based on your preferences.',
			},
			{
				id: '00f5a45ed8897f8090116a27',
				subject: 'Can I sell my property through your website?',
				content: 'Absolutely, we provide services for selling properties as well.',
			},
			{
				id: '00f5a45ed8897f8090116b99',
				subject: 'What if I need help understanding legal aspects of property purchase?',
				content: 'Our team can provide basic guidance and recommend legal professionals if needed.',
			},
		],
		payment: [
			{
				id: '00f5a45ed8897f8090116a02',
				subject: 'How can I make the payment?',
				content: 'you make the payment through an agent!',
			},
			{
				id: '00f5a45ed8897f8090116a91',
				subject: 'Are there any additional fees for using your services?',
				content: 'No, our services are free for buyers. Sellers pay a commission upon successful sale.',
			},
			{
				id: '00f5a45ed8897f8090116a92',
				subject: 'Is there an option for installment payments?',
				content: 'Yes, we offer installment payment plans for certain properties. Please inquire for more details.',
			},
			{
				id: '00f5a45ed8897f8090116a93',
				subject: 'Is my payment information secure on your website?',
				content:
					'Yes, we use industry-standard encryption technology to ensure the security of your payment information.',
			},
			{
				id: '00f5a45ed8897f8090116a94',
				subject: 'Can I make payments online through your website?',
				content: "Yes, you can securely make payments online through our website's payment portal.",
			},
			{
				id: '00f5a45ed8897f8090116a95',
				subject: "What happens if there's an issue with my payment?",
				content: 'If you encounter any issues with your payment, please contact our support team for assistance.',
			},
			{
				id: '00f5a45ed8897f8090116a96',
				subject: 'Do you offer refunds for payments made?',
				content:
					'Refund policies vary depending on the circumstances. Please refer to our refund policy or contact us for more information.',
			},
			{
				id: '00f5a45ed8897f8090116a97',
				subject: 'Are there any discounts or incentives for early payments?',
				content:
					'We occasionally offer discounts or incentives for early payments. Check our promotions or contact us for current offers.',
			},
			{
				id: '00f5a45ed8897f8090116a99',
				subject: 'How long does it take for payments to be processed?',
				content:
					'Payment processing times vary depending on the payment method used. Typically, credit/debit card payments are processed instantly',
			},
			{
				id: '00f5a45ed8897f8090116a98',
				subject: 'Are there penalties for late payments?',
				content:
					'Late payment penalties may apply depending on the terms of your agreement. Please refer to your contract or contact us for details.',
			},
		],
		buyers: [
			{
				id: '00f5a45ed8897f8090116a03',
				subject: 'What should buyers pay attention to?',
				content: 'Buyers should check and decide whether the property they want to buy or rent is actually suitable!',
			},
			{
				id: '00f5a45ed8897f8090116a85',
				subject: 'How can I determine if a property is within my budget?',
				content:
					'Calculate your budget by considering your income, down payment, and potential mortgage payments. Our agents can assist you within your budget.',
			},
			{
				id: '00f5a45ed8897f8090116a84',
				subject: 'What documents do I need to provide when purchasing a property?',
				content:
					"You'll typically need identification, proof of income, bank statements, and any necessary loan documentation. Our team will guide you through.",
			},
			{
				id: '00f5a45ed8897f8090116a83',
				subject: 'What factors should I consider when choosing a neighborhood?',
				content:
					'Consider factors such as location, safety, schools, amenities, transportation, and future development plans.',
			},
			{
				id: '00f5a45ed8897f8090116a82',
				subject: 'Can I negotiate the price of a property?',
				content:
					'Yes, you can negotiate the price of a property. Our agents will assist you in making competitive offers and negotiating terms with the seller.',
			},
			{
				id: '00f5a45ed8897f8090116a81',
				subject: 'What are some red flags to watch out for when viewing properties?',
				content:
					'Watch out for signs of structural damage, water damage, mold, outdated systems, and undesirable neighborhood conditions.',
			},
			{
				id: '00f5a45ed8897f8090116a80',
				subject: 'Do you provide assistance with property inspections?',
				content:
					'Yes, we can recommend reputable inspectors and accompany you during property inspections to identify any potential issues.',
			},
			{
				id: '00f5a45ed8897f8090116a79',
				subject: 'How long does it typically take to find the right property?',
				content:
					'The timeframe varies depending on your preferences and market conditions. Our agents will work diligently to find the right property as quickly as possible.',
			},
			{
				id: '00f5a45ed8897f8090116a78',
				subject: 'What are the advantages of using a real estate agent when buying a property?',
				content:
					'Real estate agents provide expertise, negotiation skills, and guidance throughout the buying process, ultimately saving you time and hassle.',
			},
			{
				id: '00f5a45ed8897f8090116a77',
				subject: 'What happens if I change my mind about a property after making an offer?',
				content:
					'Depending on the terms of the offer and the stage of the transaction, you may have options to withdraw your offer.',
			},
		],
		sellers: [
			{
				id: 'seller-01',
				subject: 'How do I list my property on your platform?',
				content:
					'You can list your property by creating an account and following our simple listing process. Our team will guide you through each step.',
			},
			{
				id: 'seller-02',
				subject: 'What commission rates do you charge?',
				content:
					'Our commission rates are competitive and vary based on the property value and type of service required. Contact us for specific details.',
			},
			{
				id: 'seller-03',
				subject: 'How long does it typically take to sell a property?',
				content:
					'The selling time varies depending on market conditions, property location, and pricing. On average, properties sell within 30-90 days.',
			},
			{
				id: 'seller-04',
				subject: 'What documents do I need to sell my property?',
				content:
					'Required documents include proof of ownership, tax records, property details, and any relevant permits or certificates.',
			},
			{
				id: 'seller-05',
				subject: 'How do you determine the listing price?',
				content:
					'We conduct a thorough market analysis, considering comparable properties, location, condition, and current market trends.',
			},
		],
		agents: [
			{
				id: 'agent-01',
				subject: 'How can I become an agent on your platform?',
				content:
					'To become an agent, you need to submit your credentials, complete our verification process, and agree to our terms of service.',
			},
			{
				id: 'agent-02',
				subject: 'What support do you provide to agents?',
				content:
					'We provide marketing tools, lead generation, training resources, and dedicated support to help agents succeed.',
			},
			{
				id: 'agent-03',
				subject: 'How are agent commissions structured?',
				content:
					'Commission structures are competitive and based on property values and transaction types. Contact us for detailed information.',
			},
			{
				id: 'agent-04',
				subject: 'What tools are available for agents?',
				content:
					'Agents have access to our property management system, marketing tools, client database, and analytics dashboard.',
			},
			{
				id: 'agent-05',
				subject: 'How do you handle agent-client disputes?',
				content: 'We have a dedicated resolution process to handle any disputes fairly and professionally.',
			},
		],
		legal: [
			{
				id: 'legal-01',
				subject: 'What legal protection do you provide?',
				content:
					'We ensure all transactions comply with local laws and regulations, and provide standard legal documentation.',
			},
			{
				id: 'legal-02',
				subject: 'How do you handle property disputes?',
				content:
					'We have a structured dispute resolution process and work with legal professionals to resolve any issues.',
			},
			{
				id: 'legal-03',
				subject: 'What are the terms of service?',
				content:
					'Our terms of service cover user rights, responsibilities, and platform usage guidelines. You can view them on our website.',
			},
			{
				id: 'legal-04',
				subject: 'How do you protect user data?',
				content: 'We follow strict data protection protocols and comply with relevant privacy laws and regulations.',
			},
			{
				id: 'legal-05',
				subject: 'What happens in case of contract breaches?',
				content: 'Contract breaches are handled according to our terms of service and applicable laws.',
			},
		],
		general: [
			{
				id: 'general-01',
				subject: 'How do I create an account?',
				content: 'You can create an account by clicking the "Sign Up" button and following the registration process.',
			},
			{
				id: 'general-02',
				subject: 'What are your operating hours?',
				content: 'Our online platform is available 24/7, and our support team is available during business hours.',
			},
			{
				id: 'general-03',
				subject: 'How can I contact customer service?',
				content: 'You can reach us through our contact form, email, phone, or live chat during business hours.',
			},
			{
				id: 'general-04',
				subject: 'Is your platform available internationally?',
				content: 'Yes, our platform serves multiple regions, but availability may vary by location.',
			},
			{
				id: 'general-05',
				subject: 'How do I update my account information?',
				content: 'You can update your account information through your profile settings in the dashboard.',
			},
		],
		support: [
			{
				id: 'support-01',
				subject: 'How can I get technical support?',
				content: 'Technical support is available through our help desk, live chat, or email support system.',
			},
			{
				id: 'support-02',
				subject: 'What is your response time for support tickets?',
				content: 'We aim to respond to all support tickets within 24 hours during business days.',
			},
			{
				id: 'support-03',
				subject: 'Do you offer phone support?',
				content: 'Yes, phone support is available during business hours for urgent matters.',
			},
			{
				id: 'support-04',
				subject: 'How do I report a problem with the website?',
				content: 'You can report issues through our support ticket system or contact our technical team directly.',
			},
			{
				id: 'support-05',
				subject: 'What support resources are available?',
				content: 'We offer documentation, video tutorials, FAQs, and direct support channels.',
			},
		],
	};

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	}

	return (
		<Stack className={'faq-content'}>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
				<Typography variant="h4" component="h1" className={'title'} sx={{ mb: 0 }}>
					Frequently Asked Questions
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
					Find answers to common questions about our services
				</Typography>
			</Box>

			<Box className={'categories'}>
				{categories.map((cat) => (
					<Chip
						key={cat.id}
						label={
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<span>{cat.icon}</span>
								<span>{cat.label}</span>
							</Box>
						}
						onClick={() => changeCategoryHandler(cat.id)}
						sx={{
							py: 2.5,
							px: 2,
							borderRadius: '12px',
							fontSize: '14px',
							fontWeight: 600,
							transition: 'all 0.2s ease-in-out',
							...(category === cat.id
								? {
										backgroundColor: '#3B82F6',
										color: '#ffffff',
										transform: 'translateY(-4px)',
										boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)',
										'&:hover': {
											backgroundColor: '#2563EB',
											boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
										},
								  }
								: {
										backgroundColor: '#F8FAFC',
										color: '#64748B',
										'&:hover': {
											backgroundColor: '#EFF6FF',
											color: '#3B82F6',
											transform: 'translateY(-4px)',
											boxShadow: '0 8px 16px rgba(59, 130, 246, 0.1)',
										},
								  }),
						}}
					/>
				))}
			</Box>

			<Box className={'wrap'}>
				{data[category].map((item: any, index: number) => (
					<Accordion
						key={item.id}
						expanded={expanded === `panel${index + 1}`}
						onChange={handleChange(`panel${index + 1}`)}
						sx={{
							'&.MuiAccordion-root': {
								borderRadius: '12px',
								mb: 2,
								overflow: 'hidden',
								border: '1px solid #E2E8F0',
								'&:before': {
									display: 'none',
								},
								'&.Mui-expanded': {
									margin: '8px 0',
								},
							},
						}}
					>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							sx={{
								backgroundColor: '#ffffff',
								'&:hover': {
									backgroundColor: '#F8FAFC',
								},
								'&.Mui-expanded': {
									backgroundColor: '#F8FAFC',
								},
							}}
						>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<HelpOutlineIcon sx={{ color: '#3B82F6' }} />
								<Typography sx={{ color: '#1E293B', fontWeight: 500 }}>{item.subject}</Typography>
							</Box>
						</AccordionSummary>
						<AccordionDetails
							sx={{
								backgroundColor: '#ffffff',
								borderTop: '1px solid #E2E8F0',
								p: 3,
							}}
						>
							<Typography sx={{ color: '#64748B', lineHeight: 1.6 }}>{item.content}</Typography>
						</AccordionDetails>
					</Accordion>
				))}
			</Box>
		</Stack>
	);
};

export default Faq;
