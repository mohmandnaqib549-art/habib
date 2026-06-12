'use client';

import { useState, useEffect } from 'react';

interface TimeZone {
  name: string;
  label: string;
  offset: string;
}

const TIME_ZONES: TimeZone[] = [
  { name: 'UTC', label: 'UTC', offset: 'UTC' },
  { name: 'America/New_York', label: 'New York (EST)', offset: 'America/New_York' },
  { name: 'America/Los_Angeles', label: 'Los Angeles (PST)', offset: 'America/Los_Angeles' },
  { name: 'Europe/London', label: 'London (GMT)', offset: 'Europe/London' },
  { name: 'Europe/Paris', label: 'Paris (CET)', offset: 'Europe/Paris' },
  { name: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: 'Asia/Tokyo' },
  { name: 'Asia/Dubai', label: 'Dubai (GST)', offset: 'Asia/Dubai' },
  { name: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: 'Asia/Shanghai' },
  { name: 'Asia/Bangkok', label: 'Bangkok (ICT)', offset: 'Asia/Bangkok' },
  { name: 'Australia/Sydney', label: 'Sydney (AEDT)', offset: 'Australia/Sydney' },
  { name: 'Asia/Tehran', label: 'Tehran (IRST)', offset: 'Asia/Tehran' },
  { name: 'Asia/Kolkata', label: 'India (IST)', offset: 'Asia/Kolkata' },
];

interface Clock {
  timezone: TimeZone;
  time: string;
  date: string;
  dayOfWeek: string;
}

export default function WorldClock() {
  const [clocks, setClocks] = useState<Clock[]>([]);
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>([
    'UTC',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
  ]);

  useEffect(() => {
    const updateClocks = () => {
      const newClocks = selectedTimezones
        .map((tzName) => {
          const timezone = TIME_ZONES.find((tz) => tz.name === tzName);
          if (!timezone) return null;

          const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone.offset,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          });

          const dateFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone.offset,
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          const dayFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone.offset,
            weekday: 'long',
          });

          return {
            timezone,
            time: formatter.format(new Date()),
            date: dateFormatter.format(new Date()),
            dayOfWeek: dayFormatter.format(new Date()),
          };
        })
        .filter((clock) => clock !== null) as Clock[];

      setClocks(newClocks);
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);

    return () => clearInterval(interval);
  }, [selectedTimezones]);

  const handleAddTimezone = (tzName: string) => {
    if (!selectedTimezones.includes(tzName)) {
      setSelectedTimezones([...selectedTimezones, tzName]);
    }
  };

  const handleRemoveTimezone = (tzName: string) => {
    setSelectedTimezones(selectedTimezones.filter((tz) => tz !== tzName));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">🌍 World Clock</h1>
          <p className="text-gray-300 text-lg">Track time across multiple time zones</p>
        </div>

        {/* Main Clock Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {clocks.map((clock) => (
            <div
              key={clock.timezone.name}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300"
            >
              {/* Digital Display */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-purple-300 mb-3">
                  {clock.timezone.label}
                </h2>
                <div className="bg-black rounded-lg p-4 font-mono mb-3 border border-purple-500">
                  <div className="text-4xl font-bold text-green-400 tracking-wider">
                    {clock.time}
                  </div>
                </div>
              </div>

              {/* Date Info */}
              <div className="space-y-2">
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-400">Date:</span> {clock.date}
                </p>
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-400">Day:</span> {clock.dayOfWeek}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveTimezone(clock.timezone.name)}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Add Timezone Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-6">Add Time Zone</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIME_ZONES.map((tz) => (
              <button
                key={tz.name}
                onClick={() => handleAddTimezone(tz.name)}
                disabled={selectedTimezones.includes(tz.name)}
                className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  selectedTimezones.includes(tz.name)
                    ? 'bg-green-600 text-white cursor-not-allowed opacity-50'
                    : 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
                }`}
              >
                {tz.label}
                {selectedTimezones.includes(tz.name) && ' ✓'}
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">About This Clock</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-purple-300 font-semibold mb-2">✨ Real-time Updates</h4>
              <p className="text-gray-300">Updates every second to show the exact current time</p>
            </div>
            <div>
              <h4 className="text-purple-300 font-semibold mb-2">🌐 Global Coverage</h4>
              <p className="text-gray-300">Track time in 12+ major cities around the world</p>
            </div>
            <div>
              <h4 className="text-purple-300 font-semibold mb-2">⚡ Easy Management</h4>
              <p className="text-gray-300">Add or remove time zones with a single click</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
