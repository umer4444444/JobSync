'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Send,
  User,
  Shield
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactMethods = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Live Chat Support",
      description: "Instant help from our Australian team",
      action: "Start Chat",
      details: "Available 24/7",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      description: "Speak directly with us",
      action: "+61 1800 555 123",
      details: "Mon–Fri, 8:30AM–5:30PM AEST",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Send us your questions",
      action: "support@JobSync.au",
      details: "We reply within 24 hours",
    }
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#B260E6]/90 to-[#3b82f6]/90" />
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Get In Touch With Our
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200">
              Australian Team
            </span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            {"Have questions about skilled work opportunities? We're here to connect you with the right employers across Australia."}
          </p>

        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6 grid grid-cols-1 xl:grid-cols-3 gap-12">

          {/* CONTACT METHODS */}
          <div className="space-y-6">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{method.description}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <p className="text-[#B260E6] font-semibold">{method.action}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> {method.details}
                      </p>
                    </div>
                    <Button className="bg-[#ED84A5] hover:bg-[#DD74A5] text-white mt-3 sm:mt-0">
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CONTACT FORM */}
          <div className="xl:col-span-2">
            <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src="/images/support.png"
                  alt="Contact Header"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#B260E6] to-[#3b82f6] opacity-90" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                  <h3 className="text-3xl font-bold mb-2">Send Us a Message</h3>
                  <p className="opacity-90 text-base">We typically respond within 24 hours</p>
                </div>
              </div>

              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          name="name"
                          placeholder="John Smith"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="pl-10 h-12 rounded-xl border-gray-200 focus:ring-[#B260E6]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="pl-10 h-12 rounded-xl border-gray-200 focus:ring-[#B260E6]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Subject *</label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        name="subject"
                        placeholder="What can we help you with?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="pl-10 h-12 rounded-xl border-gray-200 focus:ring-[#B260E6]"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Message *</label>
                    <Textarea
                      name="message"
                      rows={5}
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="rounded-xl border-gray-200 focus:ring-[#B260E6]"
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#B260E6] to-[#ED84A5] text-white py-4 rounded-xl text-lg font-semibold hover:shadow-xl hover:scale-105 transition"
                  >
                    <Send className="mr-2 h-5 w-5" /> Send Message
                  </Button>

                  <p className="text-xs text-center text-gray-500 pt-4 border-t">
                    <Shield className="inline-block h-3 w-3 mr-1 text-[#ED84A5]" />
                    Your information is secure and will never be shared.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>

      {/* PERTH OFFICE */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Visit Our <span className="text-[#B260E6]">Perth Office</span>
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Our Perth headquarters is the heart of JobSync — connecting Australia’s verified workforce.
          </p>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-3xl mx-auto">
            <div className="relative h-64">
              <Image src="/images/brisbane.png" alt="Perth Office" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-6 text-white">
                <h3 className="text-3xl font-bold">Perth, Western Australia</h3>
                <p className="text-sm opacity-90">Headquarters</p>
              </div>
            </div>

            <div className="p-8 text-left space-y-3">
              <div className="flex items-center text-gray-700">
                <MapPin className="h-5 w-5 mr-3 text-[#ED84A5]" />
                Level 3, 140 St Georges Terrace, Perth WA 6000
              </div>

              <div className="flex items-center text-gray-700">
                <Phone className="h-5 w-5 mr-3 text-[#ED84A5]" />
                +61 8 6000 1234
              </div>

              <div className="flex items-center text-gray-700">
                <Mail className="h-5 w-5 mr-3 text-[#ED84A5]" />
                contact@JobSync.au
              </div>

              <Button className="w-full mt-6 bg-gradient-to-r from-[#B260E6] to-[#ED84A5] text-white rounded-xl text-lg py-5 hover:opacity-90">
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#B260E6] to-[#3b82f6] text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Australian Career Journey?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of skilled workers who found their perfect job match through JobSync.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-[#B260E6] hover:bg-gray-100 font-semibold px-8 py-4 rounded-full text-lg">
              Browse Jobs
            </Button>
            <Button className="border-2 border-white bg-transparent hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full text-lg">
              Create Profile
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
