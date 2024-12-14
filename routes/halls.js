router.get('/find/:id', async (req, res) => {
    try {
      const venueId = req.params.id;
      const venue = await Venue.findById(venueId);
  
      if (!venue) {
        return res.status(404).json({ message: 'Venue not found' });
      }
  
      // Ensure that imageUrl is returned as a full URL
      const venueData = {
        venueName: venue.venueName,
        address: venue.address,
        imageUrl: venue.imageUrl,  // Make sure this is the full URL
        description: venue.description,
        capacity: venue.capacity,
        acceptedPayments: venue.acceptedPayments,
      };
  
      res.status(200).json(venueData);
    } catch (error) {
      console.error('Error fetching venue:', error);
      res.status(500).json({ message: 'Error fetching venue details', error });
    }
  });
  