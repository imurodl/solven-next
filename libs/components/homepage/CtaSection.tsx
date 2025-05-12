import React from 'react';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import Link from 'next/link';

const CtaSection = () => {
	return (
		<Box
			sx={{
				py: { md: 10 },
				backgroundColor: '#fff',
				borderBottomLeftRadius: 24,
				borderBottomRightRadius: 24,
			}}
		>
			<Container sx={{ maxWidth: '1300px', mx: 'auto' }}>
				<Grid container spacing={6}>
					{/* CTA Block 1 */}
					<Grid item xs={12} md={6}>
						<Box
							className="wow fadeInUp"
							sx={{
								p: 8,
								borderRadius: 3,
								boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
								position: 'relative',
								backgroundColor: '#e9f2ff',
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
							}}
						>
							<Box>
								<Typography sx={{ fontWeight: 700, fontSize: '1.8rem', mb: 2 }}>
									Are You Looking <br /> For a Car ?
								</Typography>
								<Typography sx={{ fontSize: '0.95rem', lineHeight: 1.6, mb: 3 }}>
									We are committed to providing our customers with exceptional service.
								</Typography>
								<Button
									component={Link}
									href="/pricing"
									variant="contained"
									sx={{
										mt: 2,
										textTransform: 'none',
										fontSize: '1rem',
										px: 6,
										py: 3,
										backgroundColor: '#405FF2',
										color: '#fff',
										borderRadius: 4,
										boxShadow: 'none',
										'&:hover': {
											backgroundColor: '#324ed1',
										},
										display: 'inline-flex',
										alignItems: 'center',
										gap: 1,
									}}
								>
									Get Started
									<svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 14 14" fill="none">
										<path
											d="M13.6109 0H5.05533C4.84037 0 4.66643 0.173943 4.66643 0.388901C4.66643 0.603859 4.84037 0.777802 5.05533 0.777802H12.6721L0.113697 13.3362C-0.0382246 13.4881 -0.0382246 13.7342 0.113697 13.8861C0.18964 13.962 0.289171 14 0.388666 14C0.488161 14 0.587656 13.962 0.663635 13.8861L13.222 1.3277V8.94447C13.222 9.15943 13.3959 9.33337 13.6109 9.33337C13.8259 9.33337 13.9998 9.15943 13.9998 8.94447V0.388901C13.9998 0.173943 13.8258 0 13.6109 0Z"
											fill="white"
										/>
									</svg>
								</Button>
							</Box>
							<Box className="hover-img" sx={{ mt: 18 }}>
								<svg xmlns="http://www.w3.org/2000/svg" width={110} height={110} viewBox="0 0 110 110" fill="none">
									<path
										d="M43.1686 14.8242C36.3829 14.8242 30.2324 18.8167 27.4699 25.0145L16.292 50.093C9.59105 50.5534 4.29688 56.1314 4.29688 62.9492V75.8398C4.29688 81.7725 9.10637 86.582 15.0391 86.582H17.9835C17.9994 85.7553 18.0204 84.9288 18.0469 84.1023C17.3476 82.6768 16.9533 81.0745 16.9533 79.3796L16.7578 71.7578C16.7578 66.1212 17.9046 60.9441 22.0885 60.1012C24.0773 59.7006 25.7424 58.3456 26.5573 56.4876L40.3605 25.0145C43.1228 18.8167 49.2733 14.8242 56.0592 14.8242H43.1686Z"
										fill="#CEE1F2"
									/>
									<path
										d="M94.9609 86.582C100.894 86.582 105.703 81.7725 105.703 75.8398V62.9492C105.703 55.8299 99.9318 50.0586 92.8125 50.0586L79.5736 24.2505C76.6474 18.4688 70.7184 14.8242 64.2383 14.8242H43.1686C36.3829 14.8242 30.2324 18.8167 27.4699 25.0145L16.292 50.093C9.59105 50.5534 4.29688 56.1314 4.29688 62.9492V75.8398C4.29688 81.7725 9.10637 86.582 15.0391 86.582"
										stroke="#405FF2"
										strokeWidth={5}
										strokeMiterlimit={10}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M38.0269 95.1758C42.7731 95.1758 46.6207 91.3282 46.6207 86.582C46.6207 81.8358 42.7731 77.9883 38.0269 77.9883C33.2807 77.9883 29.4332 81.8358 29.4332 86.582C29.4332 91.3282 33.2807 95.1758 38.0269 95.1758Z"
										stroke="#405FF2"
										strokeWidth={5}
										strokeMiterlimit={10}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M63.1641 86.582H49.8433"
										stroke="#405FF2"
										strokeWidth={5}
										strokeMiterlimit={10}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M71.9727 95.1758C76.7189 95.1758 80.5664 91.3282 80.5664 86.582C80.5664 81.8358 76.7189 77.9883 71.9727 77.9883C67.2265 77.9883 63.3789 81.8358 63.3789 86.582C63.3789 91.3282 67.2265 95.1758 71.9727 95.1758Z"
										stroke="#405FF2"
										strokeWidth={5}
										strokeMiterlimit={10}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M51.5608 66.8164L63.5304 55.2099C65.9362 52.8587 64.2729 48.7712 60.9101 48.7712H49.9475C46.5786 48.7712 44.9182 44.6705 47.3367 42.3234L59.7328 30.293"
										stroke="#FF5CF3"
										strokeWidth={5}
										strokeMiterlimit={10}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</Box>
						</Box>
					</Grid>

					{/* CTA Block 2 */}
					<Grid item xs={12} md={6}>
						<Box
							className="wow fadeInUp"
							sx={{
								p: 8,
								borderRadius: 3,
								boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
								position: 'relative',
								backgroundColor: '#ffe9f3',
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
							}}
						>
							<Box>
								<Typography sx={{ fontWeight: 700, fontSize: '1.8rem', mb: 2 }}>
									Do You Want to <br /> Sell a Car ?
								</Typography>
								<Typography sx={{ fontSize: '0.95rem', lineHeight: 1.6, mb: 3 }}>
									We are committed to providing our customers with exceptional service.
								</Typography>
								<Button
									component={Link}
									href="/pricing"
									variant="contained"
									sx={{
										mt: 2,
										textTransform: 'none',
										fontSize: '1rem',
										px: 6,
										py: 3,
										backgroundColor: '#000',
										color: '#fff',
										borderRadius: 4,
										boxShadow: 'none',
										'&:hover': {
											backgroundColor: '#111',
										},
										display: 'inline-flex',
										alignItems: 'center',
										gap: 1,
									}}
								>
									Get Started
									<svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 14 14" fill="none">
										<path
											d="M13.6109 0H5.05533C4.84037 0 4.66643 0.173943 4.66643 0.388901C4.66643 0.603859 4.84037 0.777802 5.05533 0.777802H12.6721L0.113697 13.3362C-0.0382246 13.4881 -0.0382246 13.7342 0.113697 13.8861C0.18964 13.962 0.289171 14 0.388666 14C0.488161 14 0.587656 13.962 0.663635 13.8861L13.222 1.3277V8.94447C13.222 9.15943 13.3959 9.33337 13.6109 9.33337C13.8259 9.33337 13.9998 9.15943 13.9998 8.94447V0.388901C13.9998 0.173943 13.8258 0 13.6109 0Z"
											fill="white"
										/>
									</svg>
								</Button>
							</Box>
							<Box className="hover-img" sx={{ mt: 18 }}>
								<svg xmlns="http://www.w3.org/2000/svg" width={110} height={110} viewBox="0 0 110 110" fill="none">
									<path
										d="M17.1875 84.2276V25.7724C17.1875 13.9118 26.779 4.29688 38.6109 4.29688H25.5664C13.7008 4.29688 4.08203 13.9156 4.08203 25.7812V84.2188C4.08203 96.0841 13.7008 105.703 25.5664 105.703H38.6109C26.779 105.703 17.1875 96.0882 17.1875 84.2276Z"
										fill="#CEE1F2"
									/>
									<path
										d="M72.4023 104.506C70.1826 105.281 67.7967 105.703 65.3125 105.703H25.7812C13.9156 105.703 4.29688 96.0841 4.29688 84.2188V25.7812C4.29688 13.9156 13.9156 4.29688 25.7812 4.29688H65.3125C77.1779 4.29688 86.7969 13.9156 86.7969 25.7812V48.3398M54.7852 82.2852H71.1133M21.4844 82.0703L25.4341 86.1614C27.1343 87.8681 29.8912 87.8681 31.5915 86.1614L39.7461 77.7734"
										stroke="#405FF2"
										strokeWidth={5}
										strokeMiterlimit={10}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M105.047 70.0629C100.32 68.2247 97.1951 67.9622 94.8535 67.9622C90.5029 67.9622 87.0117 71.489 87.0117 75.8398C87.0117 80.1906 90.9148 83.7175 96.6917 83.7175C101.681 83.7175 105.703 87.2444 105.703 91.5952C105.703 95.9458 101.961 99.4729 97.6106 99.4729C95.5763 99.4729 91.0458 98.8124 86.582 97.038M96.6797 67.9622V61.0156M96.6797 99.4727V105.703M57.793 57.793V59.5117M34.1602 57.793V59.5117"
										stroke="#FF5CF4"
										strokeWidth={5}
										strokeMiterlimit={10}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M68.5352 36.7383H68.1835C68.1734 36.7146 68.1661 36.6902 68.1557 36.6667L64.3038 28.1203C64.3002 28.1123 64.2967 28.1046 64.2931 28.0966C62.5023 24.1867 58.9291 21.3217 54.734 20.4329C52.2427 19.9053 49.1996 19.5508 45.8829 19.5508C42.6308 19.5508 39.6816 19.8928 37.2649 20.402C33.0507 21.2902 29.4639 24.1577 27.6706 28.0728C27.6669 28.0807 27.6635 28.0887 27.6598 28.0966L23.7974 36.6665C23.7869 36.6899 23.7798 36.7144 23.7697 36.7381H23.418C21.0448 36.7381 19.1211 38.6618 19.1211 41.0349C19.1211 43.4081 21.0448 45.3318 23.418 45.3318V49.303C23.418 54.8137 27.8339 59.2969 33.2617 59.2969H58.6912C64.1193 59.2969 68.5352 54.8137 68.5352 49.3032V45.332C70.9083 45.332 72.832 43.4083 72.832 41.0352C72.832 38.662 70.9083 36.7383 68.5352 36.7383ZM35.4885 31.6415C36.1541 30.1969 37.4799 29.1393 39.0369 28.8112C40.6093 28.4799 42.9015 28.1445 45.8831 28.1445C48.9326 28.1445 51.3212 28.4945 52.953 28.8402C54.4951 29.167 55.811 30.2227 56.4755 31.6654L58.7617 36.7383H33.1914L35.4885 31.6415ZM35.0195 53.0664C32.1718 53.0664 29.8633 50.7579 29.8633 47.9102C29.8633 45.0624 32.1718 42.7539 35.0195 42.7539C37.8673 42.7539 40.1758 45.0624 40.1758 47.9102C40.1758 50.7579 37.8673 53.0664 35.0195 53.0664ZM56.9336 53.0664C54.0858 53.0664 51.7773 50.7579 51.7773 47.9102C51.7773 45.0624 54.0858 42.7539 56.9336 42.7539C59.7813 42.7539 62.0898 45.0624 62.0898 47.9102C62.0898 50.7579 59.7813 53.0664 56.9336 53.0664Z"
										fill="#FF5CF4"
									/>
								</svg>
							</Box>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default CtaSection;
