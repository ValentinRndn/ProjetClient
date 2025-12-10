import React, { useState } from 'react';
import { Send, CheckCircle, User, Mail, Phone, MessageSquare } from 'lucide-react';

/**
 * ContactForm - Formulaire de contact complet avec validation
 */
export default function ContactForm() {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est obligatoire';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est obligatoire';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Simulation d'envoi
    console.log('Formulaire envoyé:', formData);
    setSubmitted(true);

    // Reset après 3s
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        lastName: '',
        firstName: '',
        email: '',
        phone: '',
        message: ''
      });
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-bleu-nuit mb-2">
            Message envoyé !
          </h3>
          <p className="text-gray-600">
            Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom */}
        <div>
          <label className="flex items-center gap-2 font-semibold text-bleu-nuit mb-2">
            <User size={18} className="text-indigo-violet" />
            Nom <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-bleu-nuit ${
              errors.lastName
                ? 'border-red-500 focus:border-red-600'
                : 'border-gray-200 focus:border-indigo-violet'
            }`}
            placeholder="Votre nom"
          />
          {errors.lastName && (
            <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* Prénom */}
        <div>
          <label className="flex items-center gap-2 font-semibold text-bleu-nuit mb-2">
            <User size={18} className="text-indigo-violet" />
            Prénom <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-bleu-nuit ${
              errors.firstName
                ? 'border-red-500 focus:border-red-600'
                : 'border-gray-200 focus:border-indigo-violet'
            }`}
            placeholder="Votre prénom"
          />
          {errors.firstName && (
            <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 font-semibold text-bleu-nuit mb-2">
            <Mail size={18} className="text-indigo-violet" />
            Email <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-bleu-nuit ${
              errors.email
                ? 'border-red-500 focus:border-red-600'
                : 'border-gray-200 focus:border-indigo-violet'
            }`}
            placeholder="votre.email@exemple.fr"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Téléphone */}
        <div>
          <label className="flex items-center gap-2 font-semibold text-bleu-nuit mb-2">
            <Phone size={18} className="text-indigo-violet" />
            Téléphone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-violet focus:outline-none transition-colors text-bleu-nuit"
            placeholder="06 00 00 00 00"
          />
        </div>

        {/* Message */}
        <div>
          <label className="flex items-center gap-2 font-semibold text-bleu-nuit mb-2">
            <MessageSquare size={18} className="text-indigo-violet" />
            Message <span className="text-red-600">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-bleu-nuit resize-none ${
              errors.message
                ? 'border-red-500 focus:border-red-600'
                : 'border-gray-200 focus:border-indigo-violet'
            }`}
            placeholder="Votre message..."
          />
          {errors.message && (
            <p className="text-red-600 text-sm mt-1">{errors.message}</p>
          )}
        </div>

        {/* Mentions */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <p className="text-xs text-bleu-nuit leading-relaxed">
            <strong>Mentions obligatoires</strong><br />
            Les données ci-dessus sont nécessaires pour répondre à votre demande de contact.
            Elles sont traitées conformément à notre politique de confidentialité.
          </p>
        </div>

        {/* Bouton */}
        <button
          type="submit"
          className="w-full py-4 bg-bleu-nuit text-white rounded-lg font-bold text-lg hover:bg-bleu-nuit transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
        >
          <Send size={20} />
          ENVOYER
        </button>
      </form>
    </div>
  );
}
