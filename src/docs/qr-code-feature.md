# QR Code Feature for Parking Lot Owners

## Overview
The QR code feature allows parking lot owners to generate scannable QR codes for their parking lots. Customers can scan these QR codes to quickly access the parking lot page and make bookings.

## How It Works
1. Owners log into their dashboard
2. For each parking lot, they can click the QR code icon
3. A modal will appear showing the QR code for that specific lot
4. Owners can download the QR code image to print and display at their location

## Technical Implementation
- QR codes are generated on-demand when requested by the owner
- Each QR code contains the direct URL to the parking lot page
- QR codes can be downloaded as PNG images for printing

## API Endpoints
- `GET /api/qr?data={url}` - Generate a QR code for the specified URL

## Security
- Only authenticated owners can generate QR codes for their own lots
- QR codes contain public URLs that anyone can access
- No sensitive information is embedded in the QR codes

## Usage Tips
- Print QR codes in a prominent location at your parking lot
- Ensure the QR code is large enough to be easily scanned
- Test the QR code with multiple devices to ensure it works properly