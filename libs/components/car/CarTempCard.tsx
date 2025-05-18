import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import SettingsIcon from "@mui/icons-material/Settings";
import SpeedIcon from "@mui/icons-material/Speed";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Divider,
    Grid,
    IconButton,
    Link,
    Stack,
    Typography,
} from "@mui/material";
import React from "react";

const carData = {
    title: "Toyota Camry New",
    subtitle: "3.5 D5 PowerPulse Momentum 5dr AW",
    price: "$40,000",
    badge: "Great Price",
    specs: [
        { icon: <SpeedIcon fontSize="small" />, text: "20 Miles" },
        { icon: <LocalGasStationIcon fontSize="small" />, text: "Petrol" },
        { icon: <SettingsIcon fontSize="small" />, text: "Automatic" },
        { icon: <CalendarTodayIcon fontSize="small" />, text: "2023" },
    ],
    imageUrl: "/car8-660x440-jpg.png",
    detailsUrl: "https://demoapus1.com/boxcar/listing/toyota-camry-new/",
    badgeUrl: "https://demoapus1.com/boxcar/listing-label/great-price/",
};

const CarTempCard = () => {
    return (
        <Card
            sx={{
                width: 328,
                height: 436,
                borderRadius: "16px",
                overflow: "hidden",
            }}
        >
            <Box sx={{ position: "relative" }}>
                <CardMedia
                    component="img"
                    height="218"
                    image={carData.imageUrl}
                    alt={carData.title}
                    sx={{
                        backgroundSize: "cover",
                        backgroundPosition: "50% 50%",
                    }}
                />
                <Box sx={{ position: "absolute", top: 23, left: 20 }}>
                    <Link href={carData.badgeUrl} underline="none">
                        <Chip
                            label={carData.badge}
                            sx={{
                                bgcolor: "#3d923a",
                                color: "white",
                                fontWeight: 500,
                                fontSize: "14px",
                                height: 30,
                                borderRadius: "30px",
                                "& .MuiChip-label": {
                                    px: 1.5,
                                },
                            }}
                        />
                    </Link>
                </Box>
                <Box sx={{ position: "absolute", top: 20, right: 20 }}>
                    <IconButton
                        sx={{
                            bgcolor: "white",
                            width: 36,
                            height: 36,
                            "&:hover": { bgcolor: "white" },
                        }}
                    >
                        <BookmarkBorderIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            <CardContent
                sx={{
                    p: 0,
                    height: 218,
                    borderColor: "#e9e9e9",
                    borderStyle: "solid",
                    borderWidth: "0 1px 1px 1px",
                    borderRadius: "0 0 16px 16px",
                }}
            >
                <Box sx={{ px: 3.75, pt: 3 }}>
                    <Link
                        href={carData.detailsUrl}
                        underline="none"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Typography
                            variant="h6"
                            component="h2"
                            sx={{
                                fontWeight: 500,
                                fontSize: "18px",
                                lineHeight: "21.6px",
                                color: "#050b20",
                                mb: 1,
                            }}
                        >
                            {carData.title}
                        </Typography>
                    </Link>

                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: "14px",
                            lineHeight: "14px",
                            color: "#050b20",
                            mb: 2.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {carData.subtitle}
                        <br />…
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 1 }}>
                        <Grid item xs={6}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                {carData.specs[0].icon}
                                <Typography
                                    variant="body2"
                                    sx={{ fontSize: "14px", color: "#050b20" }}
                                >
                                    {carData.specs[0].text}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                {carData.specs[1].icon}
                                <Typography
                                    variant="body2"
                                    sx={{ fontSize: "14px", color: "#050b20" }}
                                >
                                    {carData.specs[1].text}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                {carData.specs[2].icon}
                                <Typography
                                    variant="body2"
                                    sx={{ fontSize: "14px", color: "#050b20" }}
                                >
                                    {carData.specs[2].text}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                {carData.specs[3].icon}
                                <Typography
                                    variant="body2"
                                    sx={{ fontSize: "14px", color: "#050b20" }}
                                >
                                    {carData.specs[3].text}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 2 }} />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                fontWeight: 700,
                                fontSize: "20px",
                                lineHeight: "30px",
                                color: "#050b20",
                            }}
                        >
                            {carData.price}
                        </Typography>
                        <Link
                            href={carData.detailsUrl}
                            underline="none"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                color: "#405ff2",
                                fontWeight: 500,
                                fontSize: "15px",
                            }}
                        >
                            View Details
                            <ArrowForwardIcon sx={{ ml: 0.5, fontSize: "14px" }} />
                        </Link>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CarTempCard;
