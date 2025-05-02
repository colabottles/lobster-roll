import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay, tap } from 'rxjs/operators';
import { LobsterShack } from '../models/lobster-shack.model';

@Injectable({
  providedIn: 'root'
})
export class LobsterShackService {
  private shacks: LobsterShack[] = [
    {
      id: 1,
      name: "Luke's Lobster",
      description: "Sustainable seafood company serving simple, coastal-inspired dishes like lobster rolls and chowders. Enjoy their signature lobster roll with just a touch of mayo and lemon butter.",
      address: "123 Harbor Drive",
      city: "Portland",
      state: "ME",
      zipCode: "04101",
      phone: "(207) 555-1234",
      website: "https://www.lukeslobster.com",
      price: 4,
      rating: 4.7,
      reviewCount: 425,
      tags: ["Casual Dining", "Seafood", "Outdoor Seating"],
      hours: {
        "Monday": "11:00 AM - 8:00 PM",
        "Tuesday": "11:00 AM - 8:00 PM",
        "Wednesday": "11:00 AM - 8:00 PM",
        "Thursday": "11:00 AM - 8:00 PM",
        "Friday": "11:00 AM - 9:00 PM",
        "Saturday": "11:00 AM - 9:00 PM",
        "Sunday": "11:00 AM - 8:00 PM"
      },
      location: {
        lat: 43.657,
        lng: -70.251
      },
      photos: [
        "https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg",
        "https://images.pexels.com/photos/3186654/pexels-photo-3186654.jpeg"
      ],
      isFavorite: false
    },
    {
      id: 2,
      name: "The Clam Shack",
      description: "A Kennebunkport institution serving fresh lobster rolls and fried seafood since 1968. Each roll is made with a 1-pound lobster on a freshly baked roll.",
      address: "2 Western Avenue",
      city: "Kennebunkport",
      state: "ME",
      zipCode: "04046",
      phone: "(207) 555-5678",
      website: "https://www.theclamshack.net",
      price: 3,
      rating: 4.9,
      reviewCount: 630,
      tags: ["Takeout", "Cash Only", "Historic"],
      hours: {
        "Monday": "11:00 AM - 7:00 PM",
        "Tuesday": "11:00 AM - 7:00 PM",
        "Wednesday": "11:00 AM - 7:00 PM",
        "Thursday": "11:00 AM - 7:00 PM",
        "Friday": "11:00 AM - 8:00 PM",
        "Saturday": "11:00 AM - 8:00 PM",
        "Sunday": "11:00 AM - 7:00 PM"
      },
      location: {
        lat: 43.359,
        lng: -70.473
      },
      photos: [
        "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg",
        "https://images.pexels.com/photos/2227960/pexels-photo-2227960.jpeg"
      ],
      isFavorite: true
    },
    {
      id: 3,
      name: "Red's Eats",
      description: "Iconic Maine lobster shack known for overstuffed lobster rolls with more than a whole lobster in each. Often has long lines but worth the wait.",
      address: "41 Water Street",
      city: "Wiscasset",
      state: "ME",
      zipCode: "04578",
      phone: "(207) 555-9012",
      price: 4,
      rating: 4.8,
      reviewCount: 1250,
      tags: ["Tourist Favorite", "Cash Only", "Roadside"],
      hours: {
        "Monday": "11:30 AM - 7:00 PM",
        "Tuesday": "11:30 AM - 7:00 PM",
        "Wednesday": "11:30 AM - 7:00 PM",
        "Thursday": "11:30 AM - 7:00 PM",
        "Friday": "11:30 AM - 7:00 PM",
        "Saturday": "11:30 AM - 7:00 PM",
        "Sunday": "11:30 AM - 7:00 PM"
      },
      location: {
        lat: 44.003,
        lng: -69.665
      },
      photos: [
        "https://images.pexels.com/photos/12016850/pexels-photo-12016850.jpeg"
      ],
      isFavorite: false
    },
    {
      id: 4,
      name: "Eventide Oyster Co.",
      description: "Modern take on the classic New England oyster bar with an innovative brown butter lobster roll served on a steamed Asian bun.",
      address: "86 Middle Street",
      city: "Portland",
      state: "ME",
      zipCode: "04101",
      phone: "(207) 555-3456",
      website: "https://www.eventideoysterco.com",
      price: 5,
      rating: 4.6,
      reviewCount: 920,
      tags: ["Upscale", "Innovative", "Craft Cocktails"],
      hours: {
        "Monday": "11:00 AM - 10:00 PM",
        "Tuesday": "11:00 AM - 10:00 PM",
        "Wednesday": "11:00 AM - 10:00 PM",
        "Thursday": "11:00 AM - 10:00 PM",
        "Friday": "11:00 AM - 11:00 PM",
        "Saturday": "11:00 AM - 11:00 PM",
        "Sunday": "11:00 AM - 10:00 PM"
      },
      location: {
        lat: 43.659,
        lng: -70.254
      },
      photos: [
        "https://images.pexels.com/photos/566343/pexels-photo-566343.jpeg"
      ],
      isFavorite: true
    },
    {
      id: 5,
      name: "Lobster Landing",
      description: "No-frills seafood spot serving hot lobster rolls with melted butter on a toasted sub roll. Simple, authentic, and delicious.",
      address: "152 Commerce Street",
      city: "Clinton",
      state: "CT",
      zipCode: "06413",
      phone: "(860) 555-7890",
      price: 3,
      rating: 4.5,
      reviewCount: 386,
      tags: ["BYOB", "Cash Only", "Waterfront"],
      hours: {
        "Monday": "Closed",
        "Tuesday": "Closed",
        "Wednesday": "11:00 AM - 5:00 PM",
        "Thursday": "11:00 AM - 5:00 PM",
        "Friday": "11:00 AM - 5:00 PM",
        "Saturday": "11:00 AM - 5:00 PM",
        "Sunday": "11:00 AM - 5:00 PM"
      },
      location: {
        lat: 41.275,
        lng: -72.528
      },
      photos: [
        "https://images.pexels.com/photos/2871757/pexels-photo-2871757.jpeg"
      ],
      isFavorite: false
    }
  ];

  private selectedShackIdSubject = new BehaviorSubject<number | null>(null);
  selectedShackId$ = this.selectedShackIdSubject.asObservable();

  private shacksSubject = new BehaviorSubject<LobsterShack[]>(this.shacks);
  shacks$ = this.shacksSubject.asObservable();

  constructor(private http: HttpClient) { }

  getShacks(): Observable<LobsterShack[]> {
    // Simulate API call
    return of(this.shacks).pipe(
      delay(300),
      tap(shacks => this.calculateDistances(shacks))
    );
  }

  getShackById(id: number): Observable<LobsterShack | undefined> {
    // Simulate API call
    return of(this.shacks.find(shack => shack.id === id)).pipe(
      delay(200)
    );
  }

  searchShacks(query: string): Observable<LobsterShack[]> {
    query = query.toLowerCase().trim();
    
    // Simulate API call
    return of(this.shacks).pipe(
      delay(300),
      map(shacks => {
        if (!query) return shacks;
        return shacks.filter(shack => 
          shack.name.toLowerCase().includes(query) ||
          shack.city.toLowerCase().includes(query) ||
          shack.state.toLowerCase().includes(query) ||
          shack.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }),
      tap(shacks => this.calculateDistances(shacks))
    );
  }

  toggleFavorite(id: number): void {
    const updatedShacks = this.shacks.map(shack => 
      shack.id === id ? { ...shack, isFavorite: !shack.isFavorite } : shack
    );
    
    this.shacks = updatedShacks;
    this.shacksSubject.next(updatedShacks);
  }

  filterByPrice(maxPrice: number): Observable<LobsterShack[]> {
    return of(this.shacks).pipe(
      map(shacks => shacks.filter(shack => shack.price <= maxPrice)),
      tap(shacks => this.calculateDistances(shacks))
    );
  }

  filterByRating(minRating: number): Observable<LobsterShack[]> {
    return of(this.shacks).pipe(
      map(shacks => shacks.filter(shack => shack.rating >= minRating)),
      tap(shacks => this.calculateDistances(shacks))
    );
  }

  filterByFavorites(): Observable<LobsterShack[]> {
    return of(this.shacks).pipe(
      map(shacks => shacks.filter(shack => shack.isFavorite)),
      tap(shacks => this.calculateDistances(shacks))
    );
  }

  sortByDistance(): Observable<LobsterShack[]> {
    return this.shacks$.pipe(
      map(shacks => {
        const sortedShacks = [...shacks].sort((a, b) => {
          if (a.distance === undefined && b.distance === undefined) return 0;
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;
          return a.distance - b.distance;
        });
        return sortedShacks;
      })
    );
  }

  sortByRating(): Observable<LobsterShack[]> {
    return this.shacks$.pipe(
      map(shacks => [...shacks].sort((a, b) => b.rating - a.rating))
    );
  }

  setSelectedShackId(id: number | null): void {
    this.selectedShackIdSubject.next(id);
  }

  private calculateDistances(shacks: LobsterShack[]): void {
    // In a real app, we would use the user's geolocation
    // For now, we'll use a mock location (Portland, Maine)
    const userLocation = {
      lat: 43.661,
      lng: -70.255
    };

    shacks.forEach(shack => {
      shack.distance = this.getDistance(
        userLocation.lat, 
        userLocation.lng,
        shack.location.lat,
        shack.location.lng
      );
    });
  }

  private getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    // Haversine formula to calculate distance between two points
    const R = 3958.8; // Earth radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return parseFloat(distance.toFixed(1));
  }

  private toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }
}