import React from 'react';
import { TextArea, TextInput, FileUploader } from './FormComponents';
import { User, Video } from 'lucide-react';

export default function Step4Presentation({ formData, updateFormData, errors }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handlePhotoUpload = ({ file, preview }) => {
    updateFormData({
      profilePhoto: file,
      profilePhotoPreview: preview
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-bleu-nuit mb-2">
          <User className="inline mr-2" size={28} />
          Votre présentation
        </h2>
        <p className="text-gray-600">
          Présentez-vous aux établissements partenaires de manière professionnelle.
        </p>
      </div>

      <TextArea
        label="Texte de présentation"
        name="presentation"
        value={formData.presentation}
        onChange={handleChange}
        placeholder="Parlez de votre parcours, vos domaines d'expertise, votre expérience pédagogique..."
        maxLength={400}
        rows={5}
        showCounter={true}
        error={errors.presentation}
        required
      />

      <FileUploader
        label="Photo de profil"
        name="profilePhoto"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handlePhotoUpload}
        preview={formData.profilePhotoPreview}
        error={errors.profilePhoto}
        helperText="Format recommandé : portrait vertical, JPG/PNG, max 10MB"
      />

      <TextInput
        label="Vidéo de présentation (optionnel)"
        name="presentationVideo"
        value={formData.presentationVideo}
        onChange={handleChange}
        placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
        type="url"
        error={errors.presentationVideo}
      />

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <p className="text-sm text-bleu-nuit">
          <strong>💡 Conseil :</strong> Une présentation claire et une photo professionnelle
          augmentent considérablement vos chances d'être contacté par les écoles. Prenez le temps
          de soigner cette étape !
        </p>
      </div>

      <div className="bg-purple-50 border-l-4 border-indigo-violet p-4 rounded-r-lg">
        <p className="text-sm text-bleu-nuit">
          <strong>🎥 Vidéo (optionnel) :</strong> Si vous ajoutez une vidéo de présentation,
          privilégiez un format court (1-2 minutes) où vous expliquez votre expertise et votre
          approche pédagogique.
        </p>
      </div>
    </div>
  );
}
