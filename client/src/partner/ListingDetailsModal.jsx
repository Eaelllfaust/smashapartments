import React from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Label = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

const Value = styled.span`
  font-size: 1rem;
  color: #333;
`;

const AmenityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
`;

const Amenity = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: ${props => props.active ? '#f0f7ff' : '#f5f5f5'};
  border-radius: 4px;
  color: ${props => props.active ? '#0066cc' : '#666'};
`;

const ListingDetailsModal = ({ isOpen, onClose, listing, type }) => {
  if (!isOpen || !listing) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return `NGN ${price.toLocaleString()}`;
  };

  const renderStayListing = () => (
    <>
      <Section>
        <SectionTitle>Property Details</SectionTitle>
        <Grid>
          <InfoItem>
            <Label>Property Name</Label>
            <Value>{listing.property_name}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Location</Label>
            <Value>{`${listing.city}, ${listing.state_name}`}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Property Type</Label>
            <Value>{listing.property_type}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Rooms</Label>
            <Value>{listing.number_of_rooms}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Bathrooms</Label>
            <Value>{listing.number_of_bathrooms}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Maximum Occupancy</Label>
            <Value>{listing.maximum_occupancy} people</Value>
          </InfoItem>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Pricing</SectionTitle>
        <Grid>
          <InfoItem>
            <Label>Price per Night</Label>
            <Value>{formatPrice(listing.price_per_night)}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Weekly Discount</Label>
            <Value>{listing.weekly_discount}%</Value>
          </InfoItem>
          <InfoItem>
            <Label>Monthly Discount</Label>
            <Value>{listing.monthly_discount}%</Value>
          </InfoItem>
          <InfoItem>
            <Label>Security Levy</Label>
            <Value>{listing.security_levy}</Value>
          </InfoItem>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Amenities</SectionTitle>
        <AmenityGrid>
          <Amenity active={listing.wifi}>WiFi</Amenity>
          <Amenity active={listing.pool}>Pool</Amenity>
          <Amenity active={listing.parking}>Parking</Amenity>
          <Amenity active={listing.gym}>Gym</Amenity>
          <Amenity active={listing.pets}>Pets Allowed</Amenity>
          <Amenity active={listing.smoking}>Smoking Allowed</Amenity>
          <Amenity active={listing.meals}>Meals</Amenity>
          <Amenity active={listing.cleaning}>Cleaning</Amenity>
        </AmenityGrid>
      </Section>
    </>
  );

  const renderOfficeSpace = () => (
    <>
      <Section>
        <SectionTitle>Office Details</SectionTitle>
        <Grid>
          <InfoItem>
            <Label>Office Name</Label>
            <Value>{listing.office_space_name}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Location</Label>
            <Value>{`${listing.city}, ${listing.state_name}`}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Office Type</Label>
            <Value>{listing.office_type}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Size</Label>
            <Value>{listing.size_of_office} sq ft</Value>
          </InfoItem>
          <InfoItem>
            <Label>Number of Desks</Label>
            <Value>{listing.number_of_desks}</Value>
          </InfoItem>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Pricing</SectionTitle>
        <Grid>
          <InfoItem>
            <Label>Daily Rate</Label>
            <Value>{formatPrice(listing.price_per_day)}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Weekly Rate</Label>
            <Value>{formatPrice(listing.price_weekly)}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Monthly Rate</Label>
            <Value>{formatPrice(listing.price_monthly)}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Security Levy</Label>
            <Value>{listing.security_levy}</Value>
          </InfoItem>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Amenities & Features</SectionTitle>
        <AmenityGrid>
          <Amenity active={listing.wifi}>WiFi</Amenity>
          <Amenity active={listing.conference_room}>Conference Room</Amenity>
          <Amenity active={listing.parking}>Parking</Amenity>
          <Amenity active={listing.printers}>Printers</Amenity>
          <Amenity active={listing.pets}>Pets Allowed</Amenity>
          <Amenity active={listing.smoking}>Smoking Allowed</Amenity>
          <Amenity active={listing.no_loud_noises}>Quiet Zone</Amenity>
          <Amenity active={listing.catering}>Catering</Amenity>
          <Amenity active={listing.administrative_support}>Admin Support</Amenity>
        </AmenityGrid>
      </Section>
    </>
  );

  const renderCarRental = () => (
    <>
      <Section>
        <SectionTitle>Vehicle Details</SectionTitle>
        <Grid>
          <InfoItem>
            <Label>Car Name/Model</Label>
            <Value>{listing.carNameModel}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Car Type</Label>
            <Value>{listing.carType}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Make & Model</Label>
            <Value>{listing.carMakeModel}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Color</Label>
            <Value>{listing.carColor}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Plate Number</Label>
            <Value>{listing.plateNumber}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Mileage</Label>
            <Value>{listing.mileage}</Value>
          </InfoItem>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Driver Information</SectionTitle>
        <Grid>
          <InfoItem>
            <Label>Driver Name</Label>
            <Value>{listing.driverName}</Value>
          </InfoItem>
          <InfoItem>
            <Label>License Number</Label>
            <Value>{listing.driverLicenseNumber}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Phone</Label>
            <Value>{listing.driverPhoneNumber}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Email</Label>
            <Value>{listing.driverEmail}</Value>
          </InfoItem>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Rental Details</SectionTitle>
        <Grid>
          <InfoItem>
            <Label>Rental Price</Label>
            <Value>{formatPrice(listing.rentalPrice)}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Insurance</Label>
            <Value>{listing.insurance}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Fuel Policy</Label>
            <Value>{listing.fuel}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Extra Driver</Label>
            <Value>{listing.extraDriver ? 'Available' : 'Not Available'}</Value>
          </InfoItem>
        </Grid>
      </Section>
    </>
  );

  const renderService = () => (
    <>
      <Section>
        <SectionTitle>Service Details</SectionTitle>
        <Grid>
          <InfoItem>
            <Label>Service Name</Label>
            <Value>{listing.serviceName}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Description</Label>
            <Value>{listing.description}</Value>
          </InfoItem>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Vehicle Information</SectionTitle>
        <Grid>
          <InfoItem>
            <Label>Car Make & Model</Label>
            <Value>{listing.carMakeModel}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Car Color</Label>
            <Value>{listing.carColor}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Plate Number</Label>
            <Value>{listing.plateNumber}</Value>
          </InfoItem>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Driver Information</SectionTitle>
        <Grid>
          <InfoItem>
            <Label>Driver Name</Label>
            <Value>{listing.driverName}</Value>
          </InfoItem>
          <InfoItem>
            <Label>License Number</Label>
            <Value>{listing.driverLicenseNumber}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Phone</Label>
            <Value>{listing.driverPhoneNumber}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Email</Label>
            <Value>{listing.driverEmail}</Value>
          </InfoItem>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Service Details & Pricing</SectionTitle>
        <Grid>
          <InfoItem>
            <Label>Pickup Price</Label>
            <Value>{formatPrice(listing.pickupPrice)}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Extra Luggage Policy</Label>
            <Value>{listing.extraLuggage}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Waiting Time Policy</Label>
            <Value>{listing.waitingTime}</Value>
          </InfoItem>
        </Grid>
      </Section>
    </>
  );

  const renderCommonSections = () => (
    <>
      <Section>
        <SectionTitle>Availability & Policies</SectionTitle>
        <Grid>
          <InfoItem>
            <Label>Available From</Label>
            <Value>{formatDate(listing.available_from || listing.availableFrom)}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Available To</Label>
            <Value>{formatDate(listing.available_to || listing.availableTo)}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Cancellation Policy</Label>
            <Value>{listing.cancellation_policy || listing.cancellationPolicy}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Refund Policy</Label>
            <Value>{listing.refund_policy || listing.refundPolicy}</Value>
          </InfoItem>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Contact Information</SectionTitle>
        <Grid>
          <InfoItem>
            <Label>Contact Name</Label>
            <Value>{listing.contact_name || listing.contactName}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Phone</Label>
            <Value>{listing.contact_phone || listing.contactPhone}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Email</Label>
            <Value>{listing.contact_email || listing.contactEmail}</Value>
          </InfoItem>
        </Grid>
      </Section>
    </>
  );

  const renderContent = () => {
    switch (type) {
      case 'stay':
        return (
          <>
            {renderStayListing()}
            {renderCommonSections()}
          </>
        );
      case 'office':
        return (
          <>
            {renderOfficeSpace()}
            {renderCommonSections()}
          </>
        );
      case 'rental':
        return (
          <>
            {renderCarRental()}
            {renderCommonSections()}
          </>
        );
      case 'service':
        return (
          <>
            {renderService()}
            {renderCommonSections()}
          </>
        );
      default:
        return <div>Unknown listing type</div>;
    }
  };

  return (
    <ModalOverlay onClick={(e) => {
      // Only close if clicking the overlay background
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <ModalContent>
        <CloseButton onClick={onClose}>
          <X size={24} />
        </CloseButton>
        {renderContent()}
      </ModalContent>
    </ModalOverlay>
  );
};

export default ListingDetailsModal;