export default function ContactMap() {
    return (
        <section className="py-16 bg-white w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Visit Our Office
            </h2>
            <p className="text-lg text-gray-600">
              We're located at Ecobank Community 11 in Tema, Ghana. Come see us in person!
            </p>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.316260780826!2d-0.002003424999999999!3d5.6832959999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf81a6d3e76a3b%3A0x5e5a3a3d5a3d3a3d!2sEcobank%20Community%2011!5e0!3m2!1sen!2sgh!4v1620000000000!5m2!1sen!2sgh"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="block"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-700">
              <strong>Address:</strong> Ecobank Community 11, Tema, Ghana
            </p>
            <p className="text-gray-600 mt-2">
              Open Monday-Friday: 8:30 AM - 5:30 PM
            </p>
          </div>
        </div>
      </section>
    )
}